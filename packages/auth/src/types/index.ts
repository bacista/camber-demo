export interface AuthConfig {
  type: 'investor' | 'demo' | 'custom';
  providers: AuthProvider[];
  sessionDuration: number; // milliseconds
  tokenExpiry: number; // milliseconds
  requireAllowlist: boolean;
  allowlist?: Record<string, UserProfile>;
  tracking: 'full' | 'anonymous' | 'none';
  rateLimit?: {
    maxAttempts: number;
    windowMs: number;
  };
  ui?: {
    title: string;
    description: string;
    logo?: string;
    primaryColor?: string;
  };
  email?: {
    from: string;
    replyTo?: string;
    templates?: EmailTemplates;
  };
}

export type AuthProvider = 'magicLink' | 'password' | 'google' | 'github';

export interface UserProfile {
  email: string;
  name?: string;
  firm?: string;
  tier?: 'partner' | 'associate' | 'analyst' | 'demo' | 'admin';
  metadata?: Record<string, any>;
}

export interface Session {
  id: string;
  userId: string;
  email: string;
  profile?: UserProfile;
  createdAt: number;
  expiresAt: number;
  metadata?: Record<string, any>;
}

export interface MagicLinkToken {
  token: string;
  email: string;
  createdAt: number;
  expiresAt: number;
  used: boolean;
  metadata?: Record<string, any>;
}

export interface AuthRequest {
  email: string;
  provider: AuthProvider;
  metadata?: Record<string, any>;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  session?: Session;
  redirectUrl?: string;
}

export interface EmailTemplates {
  magicLink?: {
    subject: string;
    html: (data: { link: string; email: string; expiryHours: number }) => string;
    text?: (data: { link: string; email: string; expiryHours: number }) => string;
  };
  welcome?: {
    subject: string;
    html: (data: { name?: string; email: string }) => string;
  };
}

export interface AnalyticsEvent {
  event: 'access_requested' | 'login_success' | 'login_failed' | 'slide_viewed' | 'session_expired';
  userId?: string;
  email?: string;
  metadata?: Record<string, any>;
  timestamp: number;
}

export interface StorageAdapter {
  get(key: string): Promise<any>;
  set(key: string, value: any, expiryMs?: number): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}