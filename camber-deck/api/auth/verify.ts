import type { VercelRequest, VercelResponse } from '@vercel/node';
import { 
  MagicLinkProvider,
  SessionManager,
  createUpstashStorage,
  createResendEmailSender,
  sanitizeInput,
  isValidToken,
  cookieUtils
} from '../../src/lib/auth';
import { authConfig } from '../../src/config/auth.config';
import { getInvestor } from '../../src/data/investors';

// Initialize dependencies
const storage = createUpstashStorage();
const emailSender = createResendEmailSender(
  process.env.RESEND_API_KEY,
  authConfig.email?.from || 'deck@camber.ai',
  authConfig.email?.replyTo || 'investors@camber.ai'
);

const magicLinkProvider = new MagicLinkProvider(
  authConfig,
  storage,
  emailSender
);

const sessionManager = new SessionManager(
  storage,
  authConfig.sessionDuration,
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200)
      .setHeader('Access-Control-Allow-Origin', corsHeaders['Access-Control-Allow-Origin'])
      .setHeader('Access-Control-Allow-Methods', corsHeaders['Access-Control-Allow-Methods'])
      .setHeader('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers'])
      .setHeader('Access-Control-Allow-Credentials', corsHeaders['Access-Control-Allow-Credentials'])
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

    // Get and validate token
    const { token: rawToken } = req.body || {};
    
    if (!rawToken) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    const token = sanitizeInput(rawToken);

    // Basic token validation
    if (!isValidToken(token)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token format'
      });
    }

    // Verify the magic link token
    const verifyResult = await magicLinkProvider.verifyToken(token);

    if (!verifyResult.success || !verifyResult.email) {
      return res.status(401).json({
        success: false,
        message: verifyResult.message || 'Invalid or expired token'
      });
    }

    // Get user profile from allowlist
    const profile = getInvestor(verifyResult.email);
    
    // Create session
    const session = await sessionManager.createSession(
      verifyResult.email,
      profile,
      {
        loginMethod: 'magic-link',
        userAgent: req.headers['user-agent'],
        ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress
      }
    );

    // Set session cookie
    const cookieValue = cookieUtils.serialize(
      'camber-session',
      session.token,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: authConfig.sessionDuration / 1000, // Convert to seconds
        path: '/'
      }
    );

    res.setHeader('Set-Cookie', cookieValue);

    // Track successful login
    if (authConfig.tracking === 'full') {
      await storage.set(
        `analytics:login:${session.id}`,
        {
          timestamp: Date.now(),
          email: verifyResult.email,
          firm: profile?.firm,
          tier: profile?.tier,
          userAgent: req.headers['user-agent'],
          ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress
        },
        7 * 24 * 60 * 60 * 1000 // Keep for 7 days
      );
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Successfully authenticated',
      session: {
        id: session.id,
        email: session.email,
        profile: session.profile,
        expiresAt: session.expiresAt
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'An error occurred during verification'
    });
  }
}