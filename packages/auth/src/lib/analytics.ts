import type { AnalyticsEvent, StorageAdapter } from '../types';

export class Analytics {
  constructor(
    private storage: StorageAdapter,
    private enabled: boolean = true
  ) {}

  /**
   * Track an event
   */
  async track(event: Omit<AnalyticsEvent, 'timestamp'>): Promise<void> {
    if (!this.enabled) return;

    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now()
    };

    // Store event with timestamp key for chronological ordering
    const key = `analytics:${fullEvent.timestamp}:${fullEvent.event}`;
    
    try {
      await this.storage.set(key, fullEvent);
      
      // Also maintain an index by email if provided
      if (fullEvent.email) {
        const emailKey = `analytics:email:${fullEvent.email}`;
        const events = (await this.storage.get(emailKey)) || [];
        events.push({
          event: fullEvent.event,
          timestamp: fullEvent.timestamp
        });
        // Keep last 100 events per email
        if (events.length > 100) {
          events.shift();
        }
        await this.storage.set(emailKey, events);
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  /**
   * Track access request
   */
  async trackAccessRequest(email: string, metadata?: Record<string, any>): Promise<void> {
    await this.track({
      event: 'access_requested',
      email,
      metadata
    });
  }

  /**
   * Track successful login
   */
  async trackLoginSuccess(email: string, metadata?: Record<string, any>): Promise<void> {
    await this.track({
      event: 'login_success',
      email,
      metadata
    });
  }

  /**
   * Track failed login
   */
  async trackLoginFailed(email: string, reason: string): Promise<void> {
    await this.track({
      event: 'login_failed',
      email,
      metadata: { reason }
    });
  }

  /**
   * Track slide view
   */
  async trackSlideView(
    email: string,
    slideNumber: number,
    slideTitle?: string
  ): Promise<void> {
    await this.track({
      event: 'slide_viewed',
      email,
      metadata: {
        slideNumber,
        slideTitle
      }
    });
  }

  /**
   * Get events for a specific email
   */
  async getEventsByEmail(email: string): Promise<any[]> {
    const emailKey = `analytics:email:${email}`;
    return (await this.storage.get(emailKey)) || [];
  }

  /**
   * Get all events in a time range
   */
  async getEvents(
    startTime: number,
    endTime: number = Date.now()
  ): Promise<AnalyticsEvent[]> {
    // This would need a more sophisticated implementation
    // with proper database queries in production
    console.log('Getting events between', new Date(startTime), 'and', new Date(endTime));
    return [];
  }

  /**
   * Get summary statistics
   */
  async getSummary(): Promise<{
    totalRequests: number;
    uniqueUsers: number;
    successfulLogins: number;
    failedLogins: number;
  }> {
    // Simplified for development
    // Production would use aggregated queries
    return {
      totalRequests: 0,
      uniqueUsers: 0,
      successfulLogins: 0,
      failedLogins: 0
    };
  }
}

/**
 * Client-side analytics for tracking user behavior
 */
export class ClientAnalytics {
  private queue: any[] = [];
  private endpoint: string;

  constructor(endpoint: string = '/api/auth/track') {
    this.endpoint = endpoint;
    
    // Flush queue periodically
    if (typeof window !== 'undefined') {
      setInterval(() => this.flush(), 10000); // Every 10 seconds
      
      // Flush on page unload
      window.addEventListener('beforeunload', () => this.flush());
    }
  }

  /**
   * Track an event (client-side)
   */
  track(event: string, data?: any): void {
    this.queue.push({
      event,
      data,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
    });

    // Flush if queue is getting large
    if (this.queue.length >= 10) {
      this.flush();
    }
  }

  /**
   * Track page view
   */
  trackPageView(page?: string): void {
    this.track('page_view', {
      page: page || (typeof window !== 'undefined' ? window.location.pathname : '')
    });
  }

  /**
   * Track time spent
   */
  trackTimeSpent(page: string, seconds: number): void {
    this.track('time_spent', {
      page,
      seconds
    });
  }

  /**
   * Flush the queue to the server
   */
  private async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ events })
      });
    } catch (error) {
      // Re-add events to queue on failure
      this.queue.unshift(...events);
      console.error('Analytics flush error:', error);
    }
  }
}

/**
 * Create analytics instance based on configuration
 */
export function createAnalytics(
  storage: StorageAdapter,
  tracking: 'full' | 'anonymous' | 'none'
): Analytics {
  return new Analytics(storage, tracking !== 'none');
}