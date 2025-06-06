// Google Analytics tracking utilities

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

// Check if Google Analytics is loaded
const isGoogleAnalyticsLoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

// Track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (!isGoogleAnalyticsLoaded()) {
    console.warn('Google Analytics not loaded');
    return;
  }

  window.gtag('event', eventName, {
    event_category: 'user_interaction',
    ...parameters,
  });
}

// Video-related events
export const trackVideoEvent = (action: string, parameters?: Record<string, any>) => {
  trackEvent('video_interaction', {
    event_category: 'video',
    action,
    ...parameters,
  });
}

// Timestamp-related events
export const trackTimestampEvent = (action: string, parameters?: Record<string, any>) => {
  trackEvent('timestamp_interaction', {
    event_category: 'timestamp',
    action,
    ...parameters,
  });
}

// Export-related events
export const trackExportEvent = (action: string, parameters?: Record<string, any>) => {
  trackEvent('export_interaction', {
    event_category: 'export',
    action,
    ...parameters,
  });
}

// UI-related events
export const trackUIEvent = (action: string, parameters?: Record<string, any>) => {
  trackEvent('ui_interaction', {
    event_category: 'ui',
    action,
    ...parameters,
  });
}

// Feature usage tracking
export const trackFeatureUsage = (feature: string, parameters?: Record<string, any>) => {
  trackEvent('feature_used', {
    event_category: 'feature_usage',
    feature_name: feature,
    ...parameters,
  });
}

// Error tracking
export const trackError = (error: string, context?: string) => {
  trackEvent('error_occurred', {
    event_category: 'error',
    error_type: error,
    error_context: context,
  });
}

// Performance tracking
export const trackPerformance = (metric: string, value: number, unit?: string) => {
  trackEvent('performance_metric', {
    event_category: 'performance',
    metric_name: metric,
    metric_value: value,
    metric_unit: unit || 'ms',
  });
}