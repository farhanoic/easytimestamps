// Google Analytics tracking utilities with robust error handling and fallbacks

import { safeAnalyticsCall } from './retryUtils'

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

interface AnalyticsConfig {
  enableRetry: boolean
  enableFallback: boolean
  maxRetries: number
  fallbackStorage: boolean
}

const defaultConfig: AnalyticsConfig = {
  enableRetry: true,
  enableFallback: true,
  maxRetries: 2,
  fallbackStorage: true
}

// Fallback analytics storage for offline scenarios
let fallbackEvents: Array<{ event: string; params: any; timestamp: number }> = []

// Check if Google Analytics is loaded and accessible
const isGoogleAnalyticsLoaded = (): boolean => {
  try {
    return typeof window !== 'undefined' && 
           typeof window.gtag === 'function' && 
           navigator.onLine
  } catch {
    return false
  }
}

// Store event in fallback storage
const storeFallbackEvent = (eventName: string, parameters?: Record<string, any>) => {
  try {
    fallbackEvents.push({
      event: eventName,
      params: parameters || {},
      timestamp: Date.now()
    })
    
    // Limit stored events to prevent memory issues
    if (fallbackEvents.length > 100) {
      fallbackEvents = fallbackEvents.slice(-50)
    }
    
    // Also store in localStorage for persistence
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('analytics_fallback', JSON.stringify(fallbackEvents))
    }
  } catch (error) {
    console.warn('Failed to store fallback analytics:', error)
  }
}

// Send stored fallback events when connection is restored
export const flushFallbackEvents = async (): Promise<void> => {
  if (!isGoogleAnalyticsLoaded() || fallbackEvents.length === 0) {
    return
  }

  try {
    const eventsToFlush = [...fallbackEvents]
    fallbackEvents = []
    
    // Send stored events with retry logic
    for (const storedEvent of eventsToFlush) {
      await safeAnalyticsCall(async () => {
        window.gtag('event', storedEvent.event, {
          ...storedEvent.params,
          stored_offline: true,
          offline_duration: Date.now() - storedEvent.timestamp
        })
      })
    }
    
    // Clear localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('analytics_fallback')
    }
    
    console.log(`Flushed ${eventsToFlush.length} stored analytics events`)
  } catch (error) {
    console.warn('Failed to flush analytics events:', error)
  }
}

// Initialize fallback events from localStorage
export const initializeFallbackAnalytics = (): void => {
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('analytics_fallback')
      if (stored) {
        fallbackEvents = JSON.parse(stored)
        console.log(`Loaded ${fallbackEvents.length} analytics events from storage`)
      }
    }
  } catch (error) {
    console.warn('Failed to load stored analytics:', error)
  }
}

// Enhanced track custom events with retry and fallback
export const trackEvent = async (
  eventName: string, 
  parameters?: Record<string, any>,
  config: Partial<AnalyticsConfig> = {}
) => {
  const opts = { ...defaultConfig, ...config }
  
  const executeAnalytics = async () => {
    if (!isGoogleAnalyticsLoaded()) {
      throw new Error('Google Analytics not available')
    }
    
    return new Promise<void>((resolve, reject) => {
      try {
        window.gtag('event', eventName, {
          event_category: 'user_interaction',
          network_status: navigator.onLine ? 'online' : 'offline',
          ...parameters,
        })
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  if (opts.enableRetry) {
    await safeAnalyticsCall(
      executeAnalytics,
      opts.enableFallback ? () => storeFallbackEvent(eventName, parameters) : undefined
    )
  } else {
    try {
      await executeAnalytics()
    } catch (error) {
      console.warn('Analytics failed:', error)
      if (opts.enableFallback) {
        storeFallbackEvent(eventName, parameters)
      }
    }
  }
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

// Contact form analytics specifically for support insights
export const trackContactFormAnalytics = {
  // Track form completion funnel
  trackFormFunnel: (step: string, data: Record<string, any> = {}) => {
    trackUIEvent('contact_form_funnel', {
      funnel_step: step,
      ...data
    });
  },

  // Track response time satisfaction (to be called when user rates response)
  trackResponseSatisfaction: (category: string, responseTime: number, satisfaction: number) => {
    trackUIEvent('support_response_satisfaction', {
      category,
      response_time_hours: responseTime,
      satisfaction_score: satisfaction, // 1-5 scale
      event_category: 'Support_Quality'
    });
  },

  // Track common support topics for FAQ optimization
  trackSupportTopic: (category: string, subject: string, resolved: boolean = false) => {
    trackUIEvent('support_topic_analysis', {
      category,
      subject_keywords: subject.toLowerCase().split(' ').slice(0, 5), // First 5 words
      resolved,
      event_category: 'Support_Analysis'
    });
  },

  // Track conversion from contact to tool usage
  trackContactToToolConversion: (timeToConversion: number, contactCategory: string) => {
    trackUIEvent('contact_to_tool_conversion', {
      conversion_time_minutes: Math.round(timeToConversion / 1000 / 60),
      original_contact_category: contactCategory,
      event_category: 'Conversion'
    });
  }
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