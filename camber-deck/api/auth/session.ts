import type { VercelRequest, VercelResponse } from '@vercel/node';
import { 
  SessionManager,
  createUpstashStorage,
  cookieUtils
} from '../../../packages/auth/src';
import { authConfig } from '../../src/config/auth.config';

// Initialize dependencies
const storage = createUpstashStorage();
const sessionManager = new SessionManager(
  storage,
  authConfig.sessionDuration,
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

  // Only allow GET
  if (req.method !== 'GET') {
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

    // Get session token from cookie
    const cookies = cookieUtils.parse(req.headers.cookie || '');
    const sessionToken = cookies['camber-session'];

    if (!sessionToken) {
      return res.status(401).json({
        success: false,
        message: 'No session found',
        authenticated: false
      });
    }

    // Validate session
    const session = await sessionManager.validateSession(sessionToken);

    if (!session) {
      // Clear invalid cookie
      const cookieValue = cookieUtils.serialize(
        'camber-session',
        '',
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 0, // Expire immediately
          path: '/'
        }
      );
      res.setHeader('Set-Cookie', cookieValue);

      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session',
        authenticated: false
      });
    }

    // Refresh session expiry (sliding window)
    await sessionManager.refreshSession(session.id);

    // Track activity if enabled
    if (authConfig.tracking === 'full') {
      await storage.set(
        `analytics:activity:${session.id}:${Date.now()}`,
        {
          timestamp: Date.now(),
          sessionId: session.id,
          email: session.email,
          userAgent: req.headers['user-agent'],
          ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress
        },
        24 * 60 * 60 * 1000 // Keep for 24 hours
      );
    }

    // Success response
    return res.status(200).json({
      success: true,
      authenticated: true,
      session: {
        id: session.id,
        email: session.email,
        profile: session.profile,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt
      }
    });

  } catch (error) {
    console.error('Session validation error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'An error occurred during session validation',
      authenticated: false
    });
  }
}