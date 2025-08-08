import type { AuthConfig, UserProfile } from '../types';

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if email is in allowlist
 */
export function isEmailAllowed(
  email: string,
  config: AuthConfig
): { allowed: boolean; profile?: UserProfile } {
  if (!config.requireAllowlist) {
    return { allowed: true };
  }

  if (!config.allowlist) {
    return { allowed: false };
  }

  const normalizedEmail = email.toLowerCase().trim();
  const profile = config.allowlist[normalizedEmail];

  return {
    allowed: !!profile,
    profile
  };
}

/**
 * Rate limiting check
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  constructor(
    private maxAttempts: number = 3,
    private windowMs: number = 60 * 60 * 1000 // 1 hour
  ) {}

  /**
   * Check if rate limit is exceeded
   */
  isLimited(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(
      timestamp => now - timestamp < this.windowMs
    );

    // Update the attempts
    this.attempts.set(identifier, recentAttempts);

    return recentAttempts.length >= this.maxAttempts;
  }

  /**
   * Record an attempt
   */
  recordAttempt(identifier: string): void {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    attempts.push(now);
    this.attempts.set(identifier, attempts);
  }

  /**
   * Reset attempts for an identifier
   */
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }

  /**
   * Get remaining attempts
   */
  getRemainingAttempts(identifier: string): number {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    const recentAttempts = attempts.filter(
      timestamp => now - timestamp < this.windowMs
    );
    return Math.max(0, this.maxAttempts - recentAttempts.length);
  }

  /**
   * Get time until reset (in ms)
   */
  getResetTime(identifier: string): number {
    const attempts = this.attempts.get(identifier) || [];
    if (attempts.length === 0) {
      return 0;
    }

    const oldestAttempt = Math.min(...attempts);
    const resetTime = oldestAttempt + this.windowMs;
    return Math.max(0, resetTime - Date.now());
  }
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9@.\-_]/gi, '');
}

/**
 * Validate token format
 */
export function isValidToken(token: string): boolean {
  // Check if token matches expected format (alphanumeric, specific length)
  return /^[a-zA-Z0-9_-]{20,40}$/.test(token);
}

/**
 * Check if request is from a trusted source
 */
export function isTrustedSource(request: Request): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  // In production, check against allowed origins
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://camber-deck.vercel.app'
  ];

  if (origin && allowedOrigins.includes(origin)) {
    return true;
  }

  if (referer) {
    const refererUrl = new URL(referer);
    return allowedOrigins.some(allowed => 
      refererUrl.origin === allowed
    );
  }

  return false;
}

/**
 * Validate auth configuration
 */
export function validateAuthConfig(config: Partial<AuthConfig>): string[] {
  const errors: string[] = [];

  if (!config.type) {
    errors.push('Auth type is required');
  }

  if (!config.providers || config.providers.length === 0) {
    errors.push('At least one auth provider is required');
  }

  if (!config.sessionDuration || config.sessionDuration < 1000) {
    errors.push('Session duration must be at least 1 second');
  }

  if (!config.tokenExpiry || config.tokenExpiry < 1000) {
    errors.push('Token expiry must be at least 1 second');
  }

  if (config.requireAllowlist && !config.allowlist) {
    errors.push('Allowlist is required when requireAllowlist is true');
  }

  return errors;
}