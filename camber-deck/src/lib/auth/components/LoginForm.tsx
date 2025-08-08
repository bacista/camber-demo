import React, { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';

export interface LoginFormProps {
  title?: string;
  description?: string;
  logo?: string | ReactNode;
  primaryColor?: string;
  requestEndpoint?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

type LoginStatus = 'idle' | 'loading' | 'success' | 'error';

export function LoginForm({
  title = 'Sign In',
  description = 'Enter your email to continue',
  logo,
  primaryColor = '#1CA6A3',
  requestEndpoint = '/api/auth/request',
  onSuccess,
  onError
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<LoginStatus>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch(requestEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'Check your email for the access link');
        onSuccess?.();
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to send access link');
        onError?.(data.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
      onError?.('Network error');
    }
  };

  if (status === 'success') {
    return (
      <div className="w-full space-y-6 p-8 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-green-900/20 border border-green-800 flex items-center justify-center">
            <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-white">Check Your Email</h2>
          <p className="mt-2 text-sm text-gray-400">
            We've sent a secure link to <strong className="text-white">{email}</strong>
          </p>
          <p className="mt-4 text-sm text-gray-500">
            The link will expire in a few hours for security reasons.
          </p>
          <button
            onClick={() => {
              setStatus('idle');
              setEmail('');
            }}
            className="mt-6 text-sm font-medium hover:underline"
            style={{ color: primaryColor }}
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-8 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800">
      <div>
        {logo && (
          <div className="flex justify-center mb-6">
            {typeof logo === 'string' ? (
              <img src={logo} alt="Logo" className="h-12" />
            ) : (
              logo
            )}
          </div>
        )}
        
        <h2 className="text-center text-2xl font-bold text-white">
          {title}
        </h2>
        
        {description && (
          <p className="mt-2 text-center text-sm text-gray-400">
            {description}
          </p>
        )}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className="appearance-none relative block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-camber-teal focus:border-transparent"
            placeholder="your@email.com"
            disabled={status === 'loading'}
          />
        </div>

        {message && (
          <div className={`text-sm ${status === 'error' ? 'text-red-400' : 'text-gray-400'}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-camber-teal disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ 
            backgroundColor: primaryColor
          } as React.CSSProperties}
        >
          {status === 'loading' ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            'Continue with Email'
          )}
        </button>
      </form>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          By continuing, you agree to our terms and privacy policy.
        </p>
      </div>
    </div>
  );
}