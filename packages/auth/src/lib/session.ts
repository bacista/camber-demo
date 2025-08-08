import type { Session, UserProfile, StorageAdapter } from '../types';
import { generateSessionId, createSessionToken, verifySessionToken } from './tokens';

export class SessionManager {
  constructor(
    private storage: StorageAdapter,
    private sessionDuration: number
  ) {}

  /**
   * Create a new session
   */
  async createSession(
    email: string,
    profile?: UserProfile,
    metadata?: Record<string, any>
  ): Promise<Session> {
    const session: Session = {
      id: generateSessionId(),
      userId: email, // For investor auth, email is the user ID
      email,
      profile,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.sessionDuration,
      metadata
    };

    // Store session in KV
    await this.storage.set(
      `session:${session.id}`,
      session,
      this.sessionDuration
    );

    // Also store by email for lookup
    await this.storage.set(
      `session:email:${email}`,
      session.id,
      this.sessionDuration
    );

    return session;
  }

  /**
   * Get session by ID
   */
  async getSession(sessionId: string): Promise<Session | null> {
    const session = await this.storage.get(`session:${sessionId}`);
    
    if (!session) {
      return null;
    }

    // Check if expired
    if (Date.now() > session.expiresAt) {
      await this.destroySession(sessionId);
      return null;
    }

    return session;
  }

  /**
   * Get session by email
   */
  async getSessionByEmail(email: string): Promise<Session | null> {
    const sessionId = await this.storage.get(`session:email:${email}`);
    if (!sessionId) {
      return null;
    }
    return this.getSession(sessionId);
  }

  /**
   * Extend session expiry
   */
  async extendSession(sessionId: string): Promise<Session | null> {
    const session = await this.getSession(sessionId);
    if (!session) {
      return null;
    }

    session.expiresAt = Date.now() + this.sessionDuration;
    
    await this.storage.set(
      `session:${session.id}`,
      session,
      this.sessionDuration
    );

    return session;
  }

  /**
   * Destroy a session
   */
  async destroySession(sessionId: string): Promise<void> {
    const session = await this.storage.get(`session:${sessionId}`);
    
    if (session) {
      await this.storage.delete(`session:${sessionId}`);
      await this.storage.delete(`session:email:${session.email}`);
    }
  }

  /**
   * Create a JWT token for the session
   */
  async createToken(session: Session): Promise<string> {
    return createSessionToken(session);
  }

  /**
   * Verify a JWT token and return the session
   */
  async verifyToken(token: string): Promise<Session | null> {
    const decoded = await verifySessionToken(token);
    if (!decoded) {
      return null;
    }

    // Get the full session from storage
    return this.getSession(decoded.id);
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<void> {
    // This would need to be implemented based on your storage adapter
    // For KV stores with TTL, this happens automatically
    console.log('Cleanup would be handled by storage TTL');
  }
}

/**
 * Cookie utilities for session management
 */
export const cookieUtils = {
  /**
   * Create a secure session cookie
   */
  createCookie(name: string, value: string, maxAge: number): string {
    const secure = process.env.NODE_ENV === 'production';
    const sameSite = 'lax'; // or 'strict' for more security
    
    return [
      `${name}=${value}`,
      `Max-Age=${maxAge}`,
      'HttpOnly',
      secure && 'Secure',
      `SameSite=${sameSite}`,
      'Path=/'
    ].filter(Boolean).join('; ');
  },

  /**
   * Parse cookie from request
   */
  parseCookie(cookieHeader: string, name: string): string | null {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    return cookies[name] || null;
  },

  /**
   * Create a deletion cookie
   */
  deleteCookie(name: string): string {
    return `${name}=; Max-Age=0; Path=/`;
  }
};