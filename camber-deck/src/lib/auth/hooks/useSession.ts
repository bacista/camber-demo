import { useEffect, useState } from 'react';
import { useSession as useSessionContext } from '../components/SessionProvider';
import { ClientAnalytics } from '../lib/analytics';

export interface UseSessionOptions {
  trackActivity?: boolean;
  activityEndpoint?: string;
  heartbeatInterval?: number;
}

export function useSession(options: UseSessionOptions = {}) {
  const context = useSessionContext();
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [analytics] = useState(() => 
    options.trackActivity ? new ClientAnalytics(options.activityEndpoint) : null
  );

  // Track page views
  useEffect(() => {
    if (analytics && context.isAuthenticated) {
      analytics.trackPageView();
    }
  }, [analytics, context.isAuthenticated]);

  // Track activity heartbeat
  useEffect(() => {
    if (!options.trackActivity || !context.isAuthenticated) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const secondsSinceLastActivity = Math.floor((now - lastActivity) / 1000);
      
      if (secondsSinceLastActivity < 60) {
        // User is active
        analytics?.track('heartbeat', {
          active: true,
          duration: secondsSinceLastActivity
        });
      }
    }, options.heartbeatInterval || 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [lastActivity, options.trackActivity, options.heartbeatInterval, context.isAuthenticated, analytics]);

  // Track user activity
  useEffect(() => {
    if (!options.trackActivity) return;

    const handleActivity = () => {
      setLastActivity(Date.now());
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [options.trackActivity]);

  return {
    ...context,
    lastActivity,
    analytics
  };
}