import { useState, useEffect } from 'react';
import { LoginForm } from '../lib/auth/components/LoginForm';
import { useAuth } from '../lib/auth/hooks/useAuth';

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [showTokenExpired, setShowTokenExpired] = useState(false);
  const [showTokenSuccess, setShowTokenSuccess] = useState(false);
  
  // For local development, bypass auth
  const isDevelopment = import.meta.env.DEV;
  
  const {
    isAuthenticated,
    isLoading,
    error,
    verifyToken,
    checkSession,
    clearError
  } = useAuth({
    requestEndpoint: '/api/auth/request',
    verifyEndpoint: '/api/auth/verify',
    logoutEndpoint: '/api/auth/logout'
  });

  // Check for magic link token in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      // Remove token from URL for security
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('token');
      window.history.replaceState({}, '', newUrl.toString());
      
      // Verify the token
      verifyToken(token)
        .then(() => {
          setShowTokenSuccess(true);
          setTimeout(() => setShowTokenSuccess(false), 3000);
        })
        .catch((err: Error) => {
          console.error('Token verification failed:', err);
          setShowTokenExpired(true);
          setTimeout(() => setShowTokenExpired(false), 5000);
        });
    }
  }, [verifyToken]);

  // Check existing session on mount
  useEffect(() => {
    // Skip auth check if we want to test locally
    // Remove this block for production
    // if (isDevelopment) {
    //   setIsAuthenticated(true);
    //   setIsChecking(false);
    //   console.log('Development mode: Auth bypassed');
    //   return;
    // }
    
    checkSession()
      .then(() => {
        // Session state is managed by the SessionProvider
        setIsChecking(false);
      })
      .catch(() => {
        setIsChecking(false);
      });
  }, [checkSession, isDevelopment]);

  // Auth state is now managed by the useAuth hook

  // Show loading state while checking auth
  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-camber-teal"></div>
          <p className="mt-4 text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Branding */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Camber</h1>
            <p className="text-gray-400">AI-Powered Order Entry</p>
          </div>

          {/* Alerts */}
          {showTokenExpired && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400 text-sm">
                Your magic link has expired. Please request a new one.
              </p>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
              <button
                onClick={clearError}
                className="mt-2 text-xs text-red-300 hover:text-red-200"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Login Form */}
          <LoginForm
            title="Investor Access"
            description="Enter your email to access the Camber pitch deck"
            primaryColor="#1CA6A3"
            requestEndpoint="/api/auth/request"
          />

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-8">
            © {new Date().getFullYear()} Camber, Inc. | Confidential and Proprietary
          </p>
        </div>
      </div>
    );
  }

  // Show success message briefly after login
  if (showTokenSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-900/20 border border-green-800">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Welcome back!</h2>
          <p className="text-gray-400">Redirecting to the pitch deck...</p>
        </div>
      </div>
    );
  }

  // User is authenticated, show the app
  return <>{children}</>;
}