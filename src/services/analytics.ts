
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
  | 'error';

// Interface for analytics service
interface AnalyticsService {
  initialize: () => void;
  pageView: (pageName: string) => void;
  track: (eventName: EventName, properties?: Record<string, any>) => void;
  setUser: (userId: string | null) => void;
  error: (message: string) => void;
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
  }
};

export default analytics;
