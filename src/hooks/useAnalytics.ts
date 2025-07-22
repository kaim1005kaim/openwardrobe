import { useCallback } from 'react';
import { AnalyticsEvent, AnalyticsContext, GenerationParams } from '@/lib/types';

// Default analytics context
const getAnalyticsContext = (): AnalyticsContext => {
  return {
    userAnonId: getOrCreateAnonId(),
    sessionId: getOrCreateSessionId(),
    device: typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
    locale: typeof navigator !== 'undefined' ? navigator.language : 'ja-JP'
  };
};

// Generate or retrieve anonymous user ID
function getOrCreateAnonId(): string {
  if (typeof window === 'undefined') return 'server';
  
  let anonId = localStorage.getItem('openwardrobe-anon-id');
  if (!anonId) {
    anonId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('openwardrobe-anon-id', anonId);
  }
  return anonId;
}

// Generate or retrieve session ID
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server-session';
  
  let sessionId = sessionStorage.getItem('openwardrobe-session-id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('openwardrobe-session-id', sessionId);
  }
  return sessionId;
}

// Analytics event queue for batching
let eventQueue: AnalyticsEvent[] = [];
let flushTimeout: NodeJS.Timeout | null = null;

// Flush events to console (later can be extended to send to analytics service)
const flushEvents = () => {
  if (eventQueue.length === 0) return;
  
  console.group('📊 Analytics Events');
  eventQueue.forEach(event => {
    console.log(`${event.event}:`, {
      properties: event.properties,
      context: event.context,
      timestamp: new Date(event.timestamp).toISOString()
    });
  });
  console.groupEnd();
  
  // In a real implementation, you would send these to your analytics service
  // Example: await fetch('/api/analytics', { method: 'POST', body: JSON.stringify(eventQueue) });
  
  eventQueue = [];
};

// Track an analytics event
const trackEvent = (event: string, properties: Record<string, any> = {}) => {
  const analyticsEvent: AnalyticsEvent = {
    event,
    properties,
    context: getAnalyticsContext(),
    timestamp: Date.now()
  };
  
  eventQueue.push(analyticsEvent);
  
  // Batch flush events after 2 seconds
  if (flushTimeout) clearTimeout(flushTimeout);
  flushTimeout = setTimeout(flushEvents, 2000);
};

// Hook for analytics functionality
export const useAnalytics = () => {
  
  // Track generation request
  const trackGenerationRequest = useCallback((params: GenerationParams, jobId: string) => {
    trackEvent('generate_request', {
      jobId,
      prompt_length: params.prompt.length,
      has_trend: !!params.designOptions.trend,
      has_color_scheme: !!params.designOptions.colorScheme,
      has_mood: !!params.designOptions.mood,
      season: params.designOptions.season,
      action: params.action || 'generate',
      ai_assist_used: params.aiAssistUsed || false,
      preset_id: params.presetId || null
    });
  }, []);

  // Track generation completion
  const trackGenerationComplete = useCallback((jobId: string, imageCount: number, duration?: number) => {
    trackEvent('generate_complete', {
      jobId,
      image_count: imageCount,
      duration_ms: duration,
      success: true
    });
  }, []);

  // Track generation error
  const trackGenerationError = useCallback((jobId: string, error: { code: string; message: string }, retryCount?: number) => {
    trackEvent('generate_error', {
      jobId,
      error_code: error.code,
      error_message: error.message,
      retry_count: retryCount || 0,
      success: false
    });
  }, []);

  // Track UI interactions
  const trackUIInteraction = useCallback((action: string, properties: Record<string, any> = {}) => {
    trackEvent('ui_interaction', {
      action,
      ...properties
    });
  }, []);

  // Track selection changes
  const trackSelectionChange = useCallback((selectionType: 'trend' | 'color' | 'mood' | 'season', value: string | null) => {
    trackEvent('selection_change', {
      selection_type: selectionType,
      value,
      has_value: !!value
    });
  }, []);

  // Track image actions
  const trackImageAction = useCallback((action: 'favorite' | 'download' | 'share' | 'delete' | 'variation', imageId: string, properties: Record<string, any> = {}) => {
    trackEvent('image_action', {
      action,
      image_id: imageId,
      ...properties
    });
  }, []);

  // Track tutorial interactions
  const trackTutorialInteraction = useCallback((step: number, action: 'view' | 'next' | 'prev' | 'skip' | 'complete') => {
    trackEvent('tutorial_interaction', {
      step,
      action
    });
  }, []);

  // Manual flush for immediate sending
  const flush = useCallback(() => {
    if (flushTimeout) {
      clearTimeout(flushTimeout);
      flushTimeout = null;
    }
    flushEvents();
  }, []);

  return {
    trackGenerationRequest,
    trackGenerationComplete,
    trackGenerationError,
    trackUIInteraction,
    trackSelectionChange,
    trackImageAction,
    trackTutorialInteraction,
    flush
  };
};

// Hook for performance tracking
export const usePerformanceTracking = () => {
  
  const trackPageLoad = useCallback((page: string, loadTime: number) => {
    trackEvent('page_load', {
      page,
      load_time_ms: loadTime
    });
  }, []);

  const trackAPICall = useCallback((endpoint: string, duration: number, success: boolean, statusCode?: number) => {
    trackEvent('api_call', {
      endpoint,
      duration_ms: duration,
      success,
      status_code: statusCode
    });
  }, []);

  const trackError = useCallback((error: Error, context: string) => {
    trackEvent('error', {
      error_message: error.message,
      error_stack: error.stack,
      context
    });
  }, []);

  return {
    trackPageLoad,
    trackAPICall,
    trackError
  };
};

// Auto-flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (flushTimeout) {
      clearTimeout(flushTimeout);
    }
    flushEvents();
  });
}

// Utility function for timing operations
export const withAnalytics = <T extends (...args: any[]) => any>(
  fn: T,
  eventName: string,
  getProperties?: (...args: Parameters<T>) => Record<string, any>
): T => {
  return ((...args: Parameters<T>) => {
    const startTime = Date.now();
    
    try {
      const result = fn(...args);
      
      // Handle promises
      if (result instanceof Promise) {
        return result
          .then((value) => {
            trackEvent(eventName, {
              success: true,
              duration_ms: Date.now() - startTime,
              ...(getProperties ? getProperties(...args) : {})
            });
            return value;
          })
          .catch((error) => {
            trackEvent(eventName, {
              success: false,
              duration_ms: Date.now() - startTime,
              error_message: error.message,
              ...(getProperties ? getProperties(...args) : {})
            });
            throw error;
          });
      }
      
      // Handle synchronous functions
      trackEvent(eventName, {
        success: true,
        duration_ms: Date.now() - startTime,
        ...(getProperties ? getProperties(...args) : {})
      });
      
      return result;
    } catch (error) {
      trackEvent(eventName, {
        success: false,
        duration_ms: Date.now() - startTime,
        error_message: error instanceof Error ? error.message : 'Unknown error',
        ...(getProperties ? getProperties(...args) : {})
      });
      throw error;
    }
  }) as T;
};