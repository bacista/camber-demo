import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.API_PORT || process.env.PORT || 3030;

// CORS configuration
const corsOrigin = process.env.NODE_ENV === 'production' 
  ? process.env.FRONTEND_URL 
  : 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

// Import auth modules dynamically
async function loadAuthModules() {
  try {
    // Since we're using TypeScript files, we need to compile them first
    // For now, we'll create simplified versions of the endpoints
    
    const { MagicLinkProvider } = await import('./src/lib/auth/providers/magic-link.js');
    const { ResendEmailSender } = await import('./src/lib/auth/providers/resend.js');
    const { UpstashSessionStorage } = await import('./src/lib/auth/providers/upstash.js');
    const { SessionManager } = await import('./src/lib/auth/lib/session.js');
    
    return {
      MagicLinkProvider,
      ResendEmailSender,
      UpstashSessionStorage,
      SessionManager
    };
  } catch (error) {
    console.log('Using simplified auth for development');
    return null;
  }
}

// Simplified auth implementation for local development
const tokens = new Map(); // In-memory token storage (short-lived, okay to lose on restart)

// Upstash Redis client for session storage
class RedisClient {
  constructor(url, token) {
    this.url = url;
    this.token = token;
  }

  async request(command) {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        console.error('Redis request failed:', response.statusText);
        return null;
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Redis error:', error);
      return null;
    }
  }

  async get(key) {
    const result = await this.request(['GET', key]);
    if (result === null) return null;
    
    try {
      return JSON.parse(result);
    } catch {
      return result;
    }
  }

  async set(key, value, expiryMs) {
    const serialized = JSON.stringify(value);
    const command = ['SET', key, serialized];
    
    if (expiryMs) {
      // Convert milliseconds to seconds for Redis EX command
      const seconds = Math.floor(expiryMs / 1000);
      command.push('EX', String(seconds));
    }
    
    return await this.request(command);
  }

  async delete(key) {
    return await this.request(['DEL', key]);
  }
}

// Initialize Redis client for production, use Map for development
let sessionStore;

if (process.env.NODE_ENV === 'production' && process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.log('Using Upstash Redis for session storage');
  sessionStore = new RedisClient(
    process.env.UPSTASH_REDIS_REST_URL,
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
} else {
  console.log('Using in-memory session storage (development mode)');
  // Fallback to in-memory storage for development
  const sessions = new Map();
  sessionStore = {
    async get(key) {
      return sessions.get(key);
    },
    async set(key, value, expiryMs) {
      sessions.set(key, value);
      // Optional: implement expiry for in-memory storage
      if (expiryMs) {
        setTimeout(() => sessions.delete(key), expiryMs);
      }
      return 'OK';
    },
    async delete(key) {
      return sessions.delete(key);
    }
  };
}

// Helper function to send email via Resend
async function sendEmailViaResend(to, subject, html, text) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || 'noreply@example.com';
  const replyTo = process.env.RESEND_REPLY_TO;

  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured, cannot send email');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        text,
        reply_to: replyTo,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Resend API error:', error);
      return false;
    }

    const data = await response.json();
    console.log('Email sent successfully via Resend:', data.id);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

// Request endpoint - sends magic link
app.post('/api/auth/request', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Generate a mock token for development
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    
    // Store token with expiry (4 hours)
    tokens.set(token, {
      email,
      expiresAt: Date.now() + (4 * 60 * 60 * 1000)
    });
    
    console.log(`[DEBUG] Token generated: ${token}`);
    console.log(`[DEBUG] Total tokens stored: ${tokens.size}`);

    // Generate magic link
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const magicLink = `${frontendUrl}/?token=${token}`;

    // Send email in production, log to console in development
    if (process.env.NODE_ENV === 'production' && process.env.RESEND_API_KEY) {
      // Create email HTML
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .button { display: inline-block; padding: 12px 24px; background-color: #1CA6A3; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; }
              .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Access Your Camber Investor Deck</h2>
              <p>Click the button below to securely access the Camber pitch deck:</p>
              <p style="margin: 30px 0;">
                <a href="${magicLink}" class="button">Access Pitch Deck</a>
              </p>
              <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
              <p style="color: #666; font-size: 14px; word-break: break-all;">${magicLink}</p>
              <div class="footer">
                <p>This link will expire in 4 hours for security reasons.</p>
                <p>If you didn't request this link, please ignore this email.</p>
                <p>© ${new Date().getFullYear()} Camber, Inc. | Confidential and Proprietary</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const emailText = `
Access Your Camber Investor Deck

Click the link below to securely access the Camber pitch deck:
${magicLink}

This link will expire in 4 hours for security reasons.
If you didn't request this link, please ignore this email.

© ${new Date().getFullYear()} Camber, Inc. | Confidential and Proprietary
      `.trim();

      const emailSent = await sendEmailViaResend(
        email,
        'Access Your Camber Investor Deck',
        emailHtml,
        emailText
      );

      if (!emailSent) {
        // Fall back to console logging if email fails
        console.log('\n=================================');
        console.log('🔗 Magic Link for', email);
        console.log(magicLink);
        console.log('=================================\n');
      }
    } else {
      // Development mode or no Resend configured - log to console
      console.log('\n=================================');
      console.log('🔗 Magic Link for', email);
      console.log(magicLink);
      console.log('=================================\n');
    }

    // Return success response
    res.json({
      success: true,
      message: process.env.NODE_ENV === 'production' 
        ? 'Magic link sent! Check your email for the access link.' 
        : 'Magic link sent! Check your console for the link in development mode.'
    });
  } catch (error) {
    console.error('Request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send magic link'
    });
  }
});

// Verify endpoint - validates token and creates session
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    console.log(`[DEBUG] Verify attempt with token: ${token}`);
    console.log(`[DEBUG] Current tokens in memory: ${tokens.size}`);
    console.log(`[DEBUG] Available tokens:`, Array.from(tokens.keys()));
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    // Check if token exists and is valid
    const tokenData = tokens.get(token);
    
    if (!tokenData) {
      console.log(`[DEBUG] Token not found in memory!`);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Check if token has expired
    if (Date.now() > tokenData.expiresAt) {
      tokens.delete(token);
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }

    // Create session
    const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const session = {
      id: sessionId,
      email: tokenData.email,
      createdAt: Date.now(),
      expiresAt: Date.now() + (14 * 24 * 60 * 60 * 1000) // 14 days
    };

    // Store session in Redis/memory with 14-day expiry
    await sessionStore.set(sessionId, session, 14 * 24 * 60 * 60 * 1000);

    // Delete used token
    tokens.delete(token);

    // Set session cookie with environment-aware settings
    res.cookie('session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production for HTTPS
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-domain in production
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
      ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }) // optional domain setting
    });

    console.log(`[DEBUG] Token verified successfully! Session created: ${sessionId}`);
    console.log(`[DEBUG] Setting cookie for email: ${session.email}`);

    res.json({
      success: true,
      session: {
        email: session.email,
        token: sessionId  // Include session token for mobile clients
      }
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify token'
    });
  }
});

// Session endpoint - checks current session
app.get('/api/auth/session', async (req, res) => {
  try {
    // Check cookie first, then Authorization header (for mobile)
    const sessionId = req.cookies.session || 
                     req.headers.authorization?.replace('Bearer ', '');
    
    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: 'No session'
      });
    }

    const session = await sessionStore.get(sessionId);
    
    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session'
      });
    }

    // Check if session has expired
    if (Date.now() > session.expiresAt) {
      await sessionStore.delete(sessionId);
      return res.status(401).json({
        success: false,
        message: 'Session expired'
      });
    }

    res.json({
      success: true,
      session: {
        email: session.email
      }
    });
  } catch (error) {
    console.error('Session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check session'
    });
  }
});

// Logout endpoint - destroys session
app.post('/api/auth/logout', async (req, res) => {
  try {
    const sessionId = req.cookies.session;
    
    if (sessionId) {
      await sessionStore.delete(sessionId);
    }

    res.clearCookie('session');
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to logout'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log('📧 Magic links will be logged to console in development mode');
  }
});