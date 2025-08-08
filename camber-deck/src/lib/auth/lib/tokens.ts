import { nanoid } from 'nanoid';
import { SignJWT, jwtVerify } from 'jose';
import type { MagicLinkToken, Session } from '../types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-change-in-production'
);

/**
 * Generate a secure random token
 */
export function generateToken(length = 32): string {
  return nanoid(length);
}

/**
 * Generate a magic link token with metadata
 */
export function createMagicLinkToken(
  email: string,
  expiryMs: number,
  metadata?: Record<string, any>
): MagicLinkToken {
  return {
    token: generateToken(),
    email,
    createdAt: Date.now(),
    expiresAt: Date.now() + expiryMs,
    used: false,
    metadata
  };
}

/**
 * Create a JWT session token
 */
export async function createSessionToken(session: Session): Promise<string> {
  return new SignJWT({ 
    sub: session.userId,
    email: session.email,
    sid: session.id,
    profile: session.profile 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(session.expiresAt / 1000))
    .sign(JWT_SECRET);
}

/**
 * Verify and decode a JWT session token
 */
export async function verifySessionToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    return {
      id: payload.sid as string,
      userId: payload.sub as string,
      email: payload.email as string,
      profile: payload.profile as any,
      createdAt: (payload.iat || 0) * 1000,
      expiresAt: (payload.exp || 0) * 1000
    };
  } catch (error) {
    return null;
  }
}

/**
 * Check if a token has expired
 */
export function isTokenExpired(expiresAt: number): boolean {
  return Date.now() > expiresAt;
}

/**
 * Generate a secure session ID
 */
export function generateSessionId(): string {
  return `sess_${generateToken(24)}`;
}

/**
 * Hash a token for secure storage (simple version, upgrade to bcrypt in production)
 */
export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Format token for URL use
 */
export function formatTokenUrl(baseUrl: string, token: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set('token', token);
  return url.toString();
}