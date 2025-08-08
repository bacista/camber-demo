import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
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
const sessions = new Map(); // In-memory session storage
const tokens = new Map(); // In-memory token storage

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

    // In development, log the magic link instead of sending email
    const magicLink = `http://localhost:5173/?token=${token}`;
    console.log('\n=================================');
    console.log('🔗 Magic Link for', email);
    console.log(magicLink);
    console.log('=================================\n');

    // Return success response
    res.json({
      success: true,
      message: 'Magic link sent! Check your console for the link in development mode.'
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
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    // Check if token exists and is valid
    const tokenData = tokens.get(token);
    
    if (!tokenData) {
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

    // Store session
    sessions.set(sessionId, session);

    // Delete used token
    tokens.delete(token);

    // Set session cookie
    res.cookie('session', sessionId, {
      httpOnly: true,
      secure: false, // false for local development
      sameSite: 'lax',
      maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days
    });

    res.json({
      success: true,
      session: {
        email: session.email
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
    const sessionId = req.cookies.session;
    
    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: 'No session'
      });
    }

    const session = sessions.get(sessionId);
    
    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session'
      });
    }

    // Check if session has expired
    if (Date.now() > session.expiresAt) {
      sessions.delete(sessionId);
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
      sessions.delete(sessionId);
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
  console.log('📧 Magic links will be logged to console in development mode');
});