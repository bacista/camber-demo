import type { VercelRequest, VercelResponse } from '@vercel/node';
import { 
  MagicLinkProvider,
  createUpstashStorage,
  createResendEmailSender,
  RateLimiter,
  isValidEmail,
  sanitizeInput
} from '../../../packages/auth/src';
import { authConfig } from '../../src/config/auth.config';
import { getInvestor } from '../../src/data/investors';

// Initialize dependencies
const storage = createUpstashStorage();
const emailSender = createResendEmailSender(
  process.env.RESEND_API_KEY,
  authConfig.email?.from || 'deck@camber.ai',
  authConfig.email?.replyTo || 'investors@camber.ai'
);

const rateLimiter = new RateLimiter(
  authConfig.rateLimit?.maxAttempts || 3,
  authConfig.rateLimit?.windowMs || 3600000
);

const magicLinkProvider = new MagicLinkProvider(
  authConfig,
  storage,
  emailSender
);

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin'])
      .setHeader('Access-Control-Allow-Methods', corsHeaders['Access-Control-Allow-Methods'])
      .setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers'])
      .setHeader('Access-Control-Max-Age', corsHeaders['Access-Control-Max-Age'])
      .end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405)
      .setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin'])
      .json({ 
        success: false, 
        message: 'Method not allowed' 
      });
  }

  try {
    // Set CORS headers for response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Get and validate email
    const { email: rawEmail } = req.body || {};
    
    if (!rawEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const email = sanitizeInput(rawEmail).toLowerCase().trim();

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check rate limiting
    const rateLimitKey = `rate:${req.headers['x-forwarded-for'] || req.socket?.remoteAddress || email}`;
    if (rateLimiter.isLimited(rateLimitKey)) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }

    // Check if email is in allowlist (for investor type)
    if (authConfig.requireAllowlist) {
      const investor = getInvestor(email);
      if (!investor) {
        // Record attempt even for unauthorized emails
        rateLimiter.recordAttempt(rateLimitKey);
        
        // Generic message to avoid email enumeration
        return res.status(200).json({
          success: true,
          message: 'If your email is authorized, you will receive a magic link shortly.'
        });
      }
    }

    // Record the attempt
    rateLimiter.recordAttempt(rateLimitKey);

    // Request magic link
    const result = await magicLinkProvider.requestAccess(email);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message || 'Failed to send magic link'
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Magic link sent! Check your email.',
      expiresInMinutes: Math.floor(authConfig.tokenExpiry / 60000)
    });

  } catch (error) {
    console.error('Magic link request error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again.'
    });
  }
}