import type { AuthConfig } from '../lib/auth/types';
import { investors } from '../data/investors';

export const authConfig: AuthConfig = {
  type: 'investor',
  providers: ['magicLink'],
  sessionDuration: 14 * 24 * 60 * 60 * 1000, // 14 days
  tokenExpiry: 4 * 60 * 60 * 1000, // 4 hours
  requireAllowlist: process.env.REQUIRE_ALLOWLIST !== 'false', // Default to true if not set
  allowlist: investors,
  tracking: 'full',
  
  rateLimit: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000 // 1 hour
  },

  ui: {
    title: 'Investor Access',
    description: 'Enter your email to access the Camber pitch deck',
    primaryColor: '#1CA6A3'
  },

  email: {
    from: 'Camber <deck@camber.ai>',
    replyTo: 'investors@camber.ai',
    templates: {
      magicLink: {
        subject: 'Access Your Camber Pitch Deck',
        html: ({ link, email, expiryHours }) => `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Access Your Camber Pitch Deck</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #1CA6A3 0%, #0E8582 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Camber</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">AI-Powered Order Entry</p>
              </div>
              
              <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
                <h2 style="color: #1CA6A3; margin-top: 0;">Exclusive Investor Access</h2>
                
                <p>Thank you for your interest in Camber.</p>
                
                <p>Click the secure link below to access our investor pitch deck:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${link}" style="display: inline-block; background: #1CA6A3; color: white; padding: 14px 35px; text-decoration: none; border-radius: 5px; font-weight: 600; font-size: 16px;">View Pitch Deck</a>
                </div>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p style="margin: 0; font-size: 13px; color: #666;">
                    <strong>Security Note:</strong> This link expires in ${expiryHours} hours and can only be used once. You'll remain logged in for 14 days after clicking.
                  </p>
                </div>
                
                <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link:</p>
                <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px; font-family: monospace;">${link}</p>
                
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                
                <p style="color: #999; font-size: 12px;">
                  This email was sent to ${email}. If you didn't request access to the Camber pitch deck, please ignore this email.
                </p>
                
                <div style="text-align: center; margin-top: 30px;">
                  <p style="color: #999; font-size: 11px; margin: 0;">
                    © ${new Date().getFullYear()} Camber, Inc. | Confidential and Proprietary
                  </p>
                </div>
              </div>
            </body>
          </html>
        `,
        text: ({ link, expiryHours }) => `
Camber - Exclusive Investor Access

Thank you for your interest in Camber.

Access our investor pitch deck using this secure link:
${link}

This link expires in ${expiryHours} hours and can only be used once.
You'll remain logged in for 14 days after clicking.

If you didn't request access to the Camber pitch deck, please ignore this email.

© ${new Date().getFullYear()} Camber, Inc. | Confidential and Proprietary
        `.trim()
      }
    }
  }
};