
import env from '@/config/env';

// Define allowed event names to enforce type safety
export type EventName = 
  | 'page_view' 
  | 'login' 
  | 'signup' 
  | 'logout'
  | 'user_identified'
  | 'review_requested'
  | 'access_denied'
  | 'error'
  | 'documentation_viewed'
  | 'performance_test_run'
  | 'api_documentation_accessed';

// Interface for analytics service
interface AnalyticsService {
  initialize: () => void;
  pageView: (pageName: string) => void;
  track: (eventName: EventName, properties?: Record<string, any>) => void;
  setUser: (userId: string | null) => void;
  error: (message: string) => void;
  logPerformance: (metrics: Record<string, number>) => void;
  logDocumentationAccess: (section: string, searchQuery?: string) => void;
}

const analytics: AnalyticsService = {
  initialize: () => {
    if (!env.ENABLE_ANALYTICS) {
      console.info('Analytics disabled');
      return;
    }
    
    console.info('Analytics initialized');
    
    // In a real app, you would initialize your analytics service here
    // Example: mixpanel.init(env.MIXPANEL_TOKEN);
    
    // Initialize performance monitoring
    if ('performance' in window && 'memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        if (memory) {
          analytics.logPerformance({
            usedJSHeapSize: memory.usedJSHeapSize / (1024 * 1024), // Convert to MB
            totalJSHeapSize: memory.totalJSHeapSize / (1024 * 1024),
            jsHeapSizeLimit: memory.jsHeapSizeLimit / (1024 * 1024)
          });
        }
      }, 60000); // Check memory usage every minute
    }
  },
  
  setUser: (userId: string | null) => {
    if (!env.ENABLE_ANALYTICS) return;
    
    if (userId) {
      console.info(`Analytics: User identified ${userId}`);
      // In a real app: mixpanel.identify(userId);
      analytics.track('user_identified', { userId });
    } else {
      console.info('Analytics: User reset');
      // In a real app: mixpanel.reset();
    }
  },
  
  pageView: (pageName: string) => {
    if (!env.ENABLE_ANALYTICS) return;
    
    console.info(`Analytics: Page view ${pageName}`);
    // In a real app: mixpanel.track('page_view', { page: pageName });
    
    // Track documentation views separately for better analytics
    if (pageName.startsWith('documentation')) {
      const section = pageName.split('/')[1] || 'main';
      analytics.logDocumentationAccess(section);
    }
  },
  
  track: (eventName: EventName, properties: Record<string, any> = {}) => {
    if (!env.ENABLE_ANALYTICS) return;
    
    // In development, log to console
    if (env.NODE_ENV === 'development') {
      console.info(`Analytics: ${eventName}`, properties);
    }
    
    // In a real app: mixpanel.track(eventName, properties);
  },
  
  error: (message: string) => {
    if (!env.ENABLE_ANALYTICS) return;
    
    console.error(`Analytics: Error ${message}`);
    analytics.track('error', { message });
    
    // In a real app, you might want to send this to an error reporting service
    // Example: Sentry.captureException(new Error(message));
  },
  
  logPerformance: (metrics: Record<string, number>) => {
    if (!env.ENABLE_ANALYTICS) return;
    
    // In development, log performance metrics to console periodically
    if (env.NODE_ENV === 'development') {
      console.debug('Performance metrics:', metrics);
    }
    
    analytics.track('performance_test_run', {
      ...metrics,
      timestamp: new Date().toISOString(),
      url: window.location.pathname,
      userAgent: navigator.userAgent
    });
  },
  
  logDocumentationAccess: (section: string, searchQuery?: string) => {
    if (!env.ENABLE_ANALYTICS) return;
    
    analytics.track('documentation_viewed', {
      section,
      searchQuery,
      timestamp: new Date().toISOString()
    });
    
    // If this is API documentation, track it separately
    if (section === 'api' || section === 'api-docs') {
      analytics.track('api_documentation_accessed', {
        searchQuery,
        timestamp: new Date().toISOString()
      });
    }
  }
};

export default analytics;
