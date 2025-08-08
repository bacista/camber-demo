import { useState, useCallback } from 'react';
import { useSession } from '../components/SessionProvider';

export interface UseAuthOptions {
  requestEndpoint?: string;
  verifyEndpoint?: string;
  logoutEndpoint?: string;
}

export function useAuth(options: UseAuthOptions = {}) {
  const { 
    session, 
    isLoading: sessionLoading, 
    isAuthenticated,
    checkSession,
    logout: sessionLogout
  } = useSession();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestAccess = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(options.requestEndpoint || '/api/auth/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to send access link');
      }

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [options.requestEndpoint]);

  const verifyToken = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(options.verifyEndpoint || '/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invalid or expired token');
      }

      // Refresh session after verification
      await checkSession();

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Verification failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [options.verifyEndpoint, checkSession]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await sessionLogout();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [sessionLogout]);

  return {
    // State
    session,
    isAuthenticated,
    isLoading: sessionLoading || isLoading,
    error,

    // Actions
    requestAccess,
    verifyToken,
    logout,
    checkSession,

    // Utilities
    clearError: () => setError(null)
  };
}