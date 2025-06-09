/**
 * Authentication Analytics Service
 * Tracks user authentication behavior and conversion metrics
 */

import { User } from '../contexts/AuthContext';

// Analytics event types
export interface AuthAnalyticsEvent {
  event: string;
  userId?: string;
  sessionId: string;
  timestamp: number;
  properties: Record<string, any>;
  userAgent: string;
  referrer: string;
  location: {
    href: string;
    pathname: string;
    search: string;
  };
}

// User session data
interface UserSession {
  sessionId: string;
  startTime: number;
  lastActivity: number;
  isAuthenticated: boolean;
  authMethod?: 'google' | 'github' | 'email';
  userId?: string;
  events: string[];
  features: Set<string>;
  pageViews: number;
}

// Analytics configuration
const ANALYTICS_CONFIG = {
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  batchSize: 10,
  flushInterval: 5000, // 5 seconds
  enableConsoleLogging: true,
  enableLocalStorage: true,
  enableBeaconAPI: true
};

class AuthAnalyticsService {
  private sessionId: string;
  private currentSession: UserSession;
  private eventQueue: AuthAnalyticsEvent[] = [];
  private flushTimer?: number;
  private sessionStartTime: number;
  private lastFeatureUsage: Map<string, number> = new Map();

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.currentSession = this.initializeSession();
    this.setupSessionTracking();
    this.startPeriodicFlush();
  }

  /**
   * Generate unique session identifier
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initialize user session
   */
  private initializeSession(): UserSession {
    const existingSession = this.getStoredSession();
    const now = Date.now();

    if (existingSession && (now - existingSession.lastActivity) < ANALYTICS_CONFIG.sessionTimeout) {
      // Continue existing session
      existingSession.lastActivity = now;
      existingSession.pageViews += 1;
      return existingSession;
    }

    // Create new session
    const session: UserSession = {
      sessionId: this.sessionId,
      startTime: now,
      lastActivity: now,
      isAuthenticated: false,
      events: [],
      features: new Set(),
      pageViews: 1
    };

    this.storeSession(session);
    return session;
  }

  /**
   * Setup session tracking
   */
  private setupSessionTracking(): void {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track('session_backgrounded');
      } else {
        this.track('session_foregrounded');
        this.updateLastActivity();
      }
    });

    // Track before page unload
    window.addEventListener('beforeunload', () => {
      this.track('session_ended', {
        duration: Date.now() - this.sessionStartTime,
        pageViews: this.currentSession.pageViews,
        featuresUsed: Array.from(this.currentSession.features),
        totalEvents: this.currentSession.events.length
      });
      this.flushEvents(true);
    });

    // Track mouse/keyboard activity
    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    const throttledUpdate = this.throttle(() => this.updateLastActivity(), 10000);
    
    activityEvents.forEach(event => {
      document.addEventListener(event, throttledUpdate, { passive: true });
    });
  }

  /**
   * Start periodic event flushing
   */
  private startPeriodicFlush(): void {
    this.flushTimer = window.setInterval(() => {
      this.flushEvents();
    }, ANALYTICS_CONFIG.flushInterval);
  }

  /**
   * Update session activity timestamp
   */
  private updateLastActivity(): void {
    this.currentSession.lastActivity = Date.now();
    this.storeSession(this.currentSession);
  }

  /**
   * Store session in localStorage
   */
  private storeSession(session: UserSession): void {
    if (!ANALYTICS_CONFIG.enableLocalStorage) return;
    
    try {
      localStorage.setItem('easy_timestamps_analytics_session', JSON.stringify({
        ...session,
        features: Array.from(session.features)
      }));
    } catch (error) {
      console.warn('Failed to store analytics session:', error);
    }
  }

  /**
   * Get stored session from localStorage
   */
  private getStoredSession(): UserSession | null {
    if (!ANALYTICS_CONFIG.enableLocalStorage) return null;
    
    try {
      const stored = localStorage.getItem('easy_timestamps_analytics_session');
      if (!stored) return null;
      
      const session = JSON.parse(stored);
      session.features = new Set(session.features || []);
      return session;
    } catch (error) {
      console.warn('Failed to retrieve analytics session:', error);
      return null;
    }
  }

  /**
   * Get user's geographic location (approximate)
   */
  private async getGeographicInfo(): Promise<any> {
    try {
      // Use a simple IP geolocation service (replace with your preferred service)
      const response = await fetch('https://ipapi.co/json/', { timeout: 3000 } as any);
      if (!response.ok) throw new Error('Geolocation failed');
      
      const data = await response.json();
      return {
        country: data.country_name,
        countryCode: data.country_code,
        region: data.region,
        city: data.city,
        timezone: data.timezone,
        latitude: data.latitude,
        longitude: data.longitude
      };
    } catch (error) {
      // Fallback to timezone-based detection
      return {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        languages: navigator.languages
      };
    }
  }

  /**
   * Track authentication events
   */
  public track(event: string, properties: Record<string, any> = {}): void {
    const analyticsEvent: AuthAnalyticsEvent = {
      event,
      userId: this.currentSession.userId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      properties: {
        ...properties,
        sessionDuration: Date.now() - this.currentSession.startTime,
        isAuthenticated: this.currentSession.isAuthenticated,
        authMethod: this.currentSession.authMethod,
        pageViews: this.currentSession.pageViews,
        featuresUsed: Array.from(this.currentSession.features),
        deviceType: this.getDeviceType(),
        screenResolution: `${screen.width}x${screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        connectionType: this.getConnectionType()
      },
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      location: {
        href: window.location.href,
        pathname: window.location.pathname,
        search: window.location.search
      }
    };

    this.eventQueue.push(analyticsEvent);
    this.currentSession.events.push(event);
    this.updateLastActivity();

    // Log to console in development
    if (ANALYTICS_CONFIG.enableConsoleLogging) {
      console.log('📊 Auth Analytics:', event, properties);
    }

    // Flush if queue is full
    if (this.eventQueue.length >= ANALYTICS_CONFIG.batchSize) {
      this.flushEvents();
    }
  }

  /**
   * Track authentication modal events
   */
  public trackModalEvent(action: 'opened' | 'closed' | 'switched', mode: 'signin' | 'signup' | 'reset', properties: any = {}): void {
    this.track(`auth_modal_${action}`, {
      mode,
      ...properties
    });
  }

  /**
   * Track authentication attempts
   */
  public trackAuthAttempt(method: 'google' | 'github' | 'email', action: 'started' | 'success' | 'failed', properties: any = {}): void {
    this.track(`auth_${action}`, {
      method,
      ...properties
    });

    if (action === 'started') {
      this.track('conversion_auth_attempt', {
        method,
        timeToAttempt: Date.now() - this.currentSession.startTime
      });
    }
  }

  /**
   * Track successful authentication
   */
  public trackAuthSuccess(user: User): void {
    this.currentSession.isAuthenticated = true;
    this.currentSession.authMethod = user.provider;
    this.currentSession.userId = user.id;
    this.storeSession(this.currentSession);

    this.track('auth_success', {
      method: user.provider,
      userId: user.id,
      userTier: user.tier,
      timeToAuth: Date.now() - this.currentSession.startTime,
      isNewUser: user.createdAt === user.lastLoginAt
    });

    this.track('conversion_guest_to_user', {
      method: user.provider,
      sessionDuration: Date.now() - this.currentSession.startTime,
      eventsBeforeAuth: this.currentSession.events.length,
      featuresUsedBeforeAuth: Array.from(this.currentSession.features)
    });
  }

  /**
   * Track feature usage
   */
  public trackFeatureUsage(feature: string, properties: any = {}): void {
    this.currentSession.features.add(feature);
    const lastUsage = this.lastFeatureUsage.get(feature) || 0;
    const timeSinceLastUse = Date.now() - lastUsage;

    this.track('feature_used', {
      feature,
      isAuthenticated: this.currentSession.isAuthenticated,
      authMethod: this.currentSession.authMethod,
      timeSinceLastUse,
      totalFeatures: this.currentSession.features.size,
      ...properties
    });

    this.lastFeatureUsage.set(feature, Date.now());
    this.storeSession(this.currentSession);
  }

  /**
   * Track user engagement metrics
   */
  public trackEngagement(action: string, properties: any = {}): void {
    this.track('user_engagement', {
      action,
      sessionDuration: Date.now() - this.currentSession.startTime,
      ...properties
    });
  }

  /**
   * Track conversion events
   */
  public trackConversion(type: string, properties: any = {}): void {
    this.track(`conversion_${type}`, {
      timeToConversion: Date.now() - this.currentSession.startTime,
      ...properties
    });
  }

  /**
   * Get device type
   */
  private getDeviceType(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
    return 'desktop';
  }

  /**
   * Get connection type
   */
  private getConnectionType(): string {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    return connection?.effectiveType || 'unknown';
  }

  /**
   * Get user segment
   */
  public getUserSegment(): {
    type: 'guest' | 'authenticated';
    method?: string;
    tier?: string;
    sessionDuration: number;
    engagement: 'low' | 'medium' | 'high';
  } {
    const sessionDuration = Date.now() - this.currentSession.startTime;
    const eventCount = this.currentSession.events.length;
    const featureCount = this.currentSession.features.size;

    let engagement: 'low' | 'medium' | 'high' = 'low';
    if (eventCount > 10 || featureCount > 3 || sessionDuration > 5 * 60 * 1000) {
      engagement = 'medium';
    }
    if (eventCount > 25 || featureCount > 5 || sessionDuration > 15 * 60 * 1000) {
      engagement = 'high';
    }

    return {
      type: this.currentSession.isAuthenticated ? 'authenticated' : 'guest',
      method: this.currentSession.authMethod,
      sessionDuration,
      engagement
    };
  }

  /**
   * Flush events to analytics service
   */
  private async flushEvents(force: boolean = false): Promise<void> {
    if (this.eventQueue.length === 0) return;
    if (!force && this.eventQueue.length < ANALYTICS_CONFIG.batchSize) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // Add geographic info to first event of session
      if (events.some(e => e.event === 'session_started')) {
        const geoInfo = await this.getGeographicInfo();
        events.forEach(event => {
          if (event.event === 'session_started') {
            event.properties.geographic = geoInfo;
          }
        });
      }

      // Send to analytics service (replace with your analytics endpoint)
      await this.sendToAnalytics(events);

    } catch (error) {
      console.warn('Failed to send analytics events:', error);
      // Re-queue events for retry (up to a limit)
      if (this.eventQueue.length < 100) {
        this.eventQueue.unshift(...events);
      }
    }
  }

  /**
   * Send events to analytics service
   */
  private async sendToAnalytics(events: AuthAnalyticsEvent[]): Promise<void> {
    // Option 1: Send to your own analytics endpoint
    try {
      const response = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events })
      });
      
      if (!response.ok) {
        throw new Error(`Analytics API error: ${response.status}`);
      }
    } catch (error) {
      // Fallback: Use Beacon API for reliability
      if (ANALYTICS_CONFIG.enableBeaconAPI && navigator.sendBeacon) {
        const data = JSON.stringify({ events });
        navigator.sendBeacon('/api/analytics/events', data);
      }
      
      // Or send to Google Analytics, Mixpanel, etc.
      this.sendToGoogleAnalytics(events);
    }
  }

  /**
   * Send to Google Analytics (example)
   */
  private sendToGoogleAnalytics(events: AuthAnalyticsEvent[]): void {
    if (typeof (window as any).gtag === 'undefined') return;

    events.forEach(event => {
      (window as any).gtag('event', event.event, {
        event_category: 'authentication',
        event_label: event.properties.method || 'unknown',
        custom_parameter_1: event.sessionId,
        custom_parameter_2: event.properties.isAuthenticated ? 'authenticated' : 'guest'
      });
    });
  }

  /**
   * Throttle function calls
   */
  private throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
    let inThrottle: boolean;
    return ((...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  }

  /**
   * Get analytics summary
   */
  public getAnalyticsSummary(): any {
    return {
      session: this.currentSession,
      segment: this.getUserSegment(),
      queuedEvents: this.eventQueue.length,
      totalEvents: this.currentSession.events.length,
      features: Array.from(this.currentSession.features),
      sessionDuration: Date.now() - this.currentSession.startTime
    };
  }

  /**
   * Destroy analytics service
   */
  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flushEvents(true);
  }
}

// Export singleton instance
export const authAnalytics = new AuthAnalyticsService();

// Initialize session tracking
authAnalytics.track('session_started');

// Global analytics function for easy access
declare global {
  interface Window {
    authAnalytics: AuthAnalyticsService;
  }
}

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.authAnalytics = authAnalytics;
}