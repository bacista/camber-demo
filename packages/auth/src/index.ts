// Types
export * from './types';

// Core utilities
export { 
  generateToken,
  createMagicLinkToken,
  createSessionToken,
  verifySessionToken,
  isTokenExpired,
  generateSessionId,
  hashToken,
  formatTokenUrl
} from './lib/tokens';

export {
  SessionManager,
  cookieUtils
} from './lib/session';

export {
  isValidEmail,
  isEmailAllowed,
  RateLimiter,
  sanitizeInput,
  isValidToken,
  isTrustedSource,
  validateAuthConfig
} from './lib/validation';

export {
  MemoryStorage,
  KVStorage,
  createStorage,
  browserStorage
} from './lib/storage';

export {
  Analytics,
  ClientAnalytics,
  createAnalytics
} from './lib/analytics';

// Providers
export {
  MagicLinkProvider,
  type EmailSender
} from './providers/magic-link';

export {
  ResendEmailSender,
  createResendEmailSender
} from './providers/resend';

// React components
export {
  SessionProvider,
  type SessionProviderProps
} from './components/SessionProvider';

export {
  ProtectedRoute,
  type ProtectedRouteProps
} from './components/ProtectedRoute';

export {
  LoginForm,
  type LoginFormProps
} from './components/LoginForm';

// Hooks
export {
  useAuth,
  type UseAuthOptions
} from './hooks/useAuth';

export {
  useSession,
  type UseSessionOptions
} from './hooks/useSession';