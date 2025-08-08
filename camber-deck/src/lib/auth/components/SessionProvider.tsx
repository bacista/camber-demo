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
  checkEndpoint = '/api/auth/session',
  logoutEndpoint = '/api/auth/logout'
}: SessionProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = async () => {
    setIsLoading(true);
    try {
      // Add timeout to prevent hanging - reduced to 3 seconds for better UX
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const endpoint = `${apiUrl}${checkEndpoint}`;
      const response = await fetch(endpoint, {
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
      // Handle abort errors silently
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('Session check timeout - treating as unauthenticated');
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
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const endpoint = `${apiUrl}${logoutEndpoint}`;
      await fetch(endpoint, {
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
    // Always check session, regardless of environment
    checkSession();
  }, []); // Remove isDevelopment from deps to prevent re-renders

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