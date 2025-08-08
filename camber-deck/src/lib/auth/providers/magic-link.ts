import type { 
  AuthConfig, 
  AuthRequest, 
  AuthResponse, 
  MagicLinkToken,
  StorageAdapter 
} from '../types';
import { createMagicLinkToken, formatTokenUrl } from '../lib/tokens';
import { isValidEmail, isEmailAllowed, RateLimiter } from '../lib/validation';
import { SessionManager } from '../lib/session';
import { Analytics } from '../lib/analytics';

export interface EmailSender {
  send(to: string, subject: string, html: string, text?: string): Promise<void>;
}

export class MagicLinkProvider {
  private rateLimiter: RateLimiter;
  private sessionManager: SessionManager;
  private analytics: Analytics;

  constructor(
    private config: AuthConfig,
    private storage: StorageAdapter,
    private emailSender: EmailSender
  ) {
    this.rateLimiter = new RateLimiter(
      config.rateLimit?.maxAttempts || 3,
      config.rateLimit?.windowMs || 60 * 60 * 1000
    );
    this.sessionManager = new SessionManager(storage, config.sessionDuration);
    this.analytics = new Analytics(storage, config.tracking !== 'none');
  }

  /**
   * Request a magic link
   */
  async requestAccess(email: string): Promise<AuthResponse> {
    // Validate email format
    if (!isValidEmail(email)) {
      await this.analytics.trackLoginFailed(email, 'invalid_email');
      return {
        success: false,
        message: 'Invalid email address'
      };
    }

    // Check rate limiting
    if (this.rateLimiter.isLimited(email)) {
      await this.analytics.trackLoginFailed(email, 'rate_limited');
      const resetTime = this.rateLimiter.getResetTime(email);
      const minutes = Math.ceil(resetTime / 60000);
      return {
        success: false,
        message: `Too many attempts. Please try again in ${minutes} minutes.`
      };
    }

    // Record attempt
    this.rateLimiter.recordAttempt(email);

    // Check allowlist
    const { allowed, profile } = isEmailAllowed(email, this.config);
    if (!allowed) {
      await this.analytics.trackLoginFailed(email, 'not_allowed');
      return {
        success: false,
        message: 'Access not authorized for this email'
      };
    }

    // Create magic link token
    const token = createMagicLinkToken(
      email,
      this.config.tokenExpiry,
      { profile }
    );

    // Store token
    await this.storage.set(
      `token:${token.token}`,
      token,
      this.config.tokenExpiry
    );

    // Generate magic link URL
    const baseUrl = process.env.APP_URL || 'http://localhost:5173';
    const magicLink = formatTokenUrl(`${baseUrl}/api/auth/verify`, token.token);

    // Send email
    try {
      const expiryHours = Math.floor(this.config.tokenExpiry / (60 * 60 * 1000));
      
      let subject = 'Access Your Camber Pitch Deck';
      let html = this.getDefaultEmailHtml(magicLink, email, expiryHours);
      let text = this.getDefaultEmailText(magicLink, email, expiryHours);

      // Use custom templates if provided
      if (this.config.email?.templates?.magicLink) {
        const template = this.config.email.templates.magicLink;
        subject = template.subject;
        html = template.html({ link: magicLink, email, expiryHours });
        if (template.text) {
          text = template.text({ link: magicLink, email, expiryHours });
        }
      }

      await this.emailSender.send(email, subject, html, text);
      
      // Track success
      await this.analytics.trackAccessRequest(email, { profile });

      // Reset rate limit on success
      this.rateLimiter.reset(email);

      return {
        success: true,
        message: 'Check your email for the access link'
      };
    } catch (error) {
      console.error('Email send error:', error);
      return {
        success: false,
        message: 'Failed to send email. Please try again.'
      };
    }
  }

  /**
   * Verify a magic link token
   */
  async verifyToken(token: string): Promise<AuthResponse> {
    // Get token from storage
    const tokenData = await this.storage.get(`token:${token}`) as MagicLinkToken | null;

    if (!tokenData) {
      return {
        success: false,
        message: 'Invalid or expired link'
      };
    }

    // Check if expired
    if (Date.now() > tokenData.expiresAt) {
      await this.storage.delete(`token:${token}`);
      return {
        success: false,
        message: 'This link has expired. Please request a new one.'
      };
    }

    // Check if already used
    if (tokenData.used) {
      return {
        success: false,
        message: 'This link has already been used'
      };
    }

    // Mark as used
    tokenData.used = true;
    await this.storage.set(`token:${token}`, tokenData, 60000); // Keep for 1 minute then delete

    // Create session
    const session = await this.sessionManager.createSession(
      tokenData.email,
      tokenData.metadata?.profile,
      { loginMethod: 'magicLink' }
    );

    // Track success
    await this.analytics.trackLoginSuccess(tokenData.email, {
      profile: tokenData.metadata?.profile
    });

    return {
      success: true,
      session,
      redirectUrl: '/'
    };
  }

  /**
   * Check if a session is valid
   */
  async checkSession(sessionId: string): Promise<AuthResponse> {
    const session = await this.sessionManager.getSession(sessionId);

    if (!session) {
      return {
        success: false,
        message: 'Session expired or invalid'
      };
    }

    // Optionally extend session on activity
    await this.sessionManager.extendSession(sessionId);

    return {
      success: true,
      session
    };
  }

  /**
   * Destroy a session
   */
  async logout(sessionId: string): Promise<void> {
    await this.sessionManager.destroySession(sessionId);
  }

  /**
   * Default email HTML template
   */
  private getDefaultEmailHtml(link: string, email: string, expiryHours: number): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Access Your Camber Pitch Deck</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1CA6A3 0%, #0E8582 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Camber</h1>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1CA6A3; margin-top: 0;">Access Your Pitch Deck</h2>
            
            <p>Hi there,</p>
            
            <p>Click the button below to securely access the Camber investor pitch deck:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${link}" style="display: inline-block; background: #1CA6A3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Access Pitch Deck</a>
            </div>
            
            <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;">${link}</p>
            
            <p style="color: #666; font-size: 14px; margin-top: 20px;">This link will expire in ${expiryHours} hours for security reasons.</p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              If you didn't request this email, please ignore it.<br>
              © ${new Date().getFullYear()} Camber. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Default email text template
   */
  private getDefaultEmailText(link: string, email: string, expiryHours: number): string {
    return `
Access Your Camber Pitch Deck

Hi there,

Click the link below to securely access the Camber investor pitch deck:

${link}

This link will expire in ${expiryHours} hours for security reasons.

If you didn't request this email, please ignore it.

© ${new Date().getFullYear()} Camber. All rights reserved.
    `.trim();
  }
}