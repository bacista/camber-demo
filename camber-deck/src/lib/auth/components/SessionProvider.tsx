import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Session } from '../types';

interface SessionContextType {
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export interface SessionProviderProps {
  children: ReactNode;
  checkEndpoint?: string;
  logoutEndpoint?: string;
}

export function SessionProvider({ 
  children,
  checkEndpoint = '/api/auth/check',
  logoutEndpoint = '/api/auth/logout'
}: SessionProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = async () => {
    setIsLoading(true);
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(checkEndpoint, {
        credentials: 'include',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setSession(data.session);
      } else {
        setSession(null);
      }
    } catch (error) {
      // Silently fail in development - API routes don't work locally
      if (import.meta.env.DEV) {
        console.log('Session check skipped in development');
      } else {
        console.error('Session check error:', error);
      }
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(logoutEndpoint, {
        method: 'POST',
        credentials: 'include'
      });
      setSession(null);
      // Redirect to login or home
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const value: SessionContextType = {
    session,
    isLoading,
    isAuthenticated: !!session,
    checkSession,
    logout
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}