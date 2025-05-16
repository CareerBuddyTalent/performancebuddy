
import env from "@/config/env";

type EventName = 
  | 'page_view'
  | 'login'
  | 'signup'
  | 'logout'
  | 'review_created'
  | 'goal_created'
  | 'survey_completed'
  | 'error_encountered';

type EventProperties = Record<string, string | number | boolean | null>;

class AnalyticsService {
  private enabled = env.ENABLE_ANALYTICS;
  private userId: string | null = null;
  private sessionId: string = this.generateSessionId();

  constructor() {
    console.log(`Analytics ${this.enabled ? 'enabled' : 'disabled'}`);
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  initialize(userId?: string) {
    if (userId) {
      this.userId = userId;
      this.track('user_identified', { user_id: userId });
    }
  }

  setUser(userId: string | null) {
    this.userId = userId;
  }

  track(eventName: EventName, properties: EventProperties = {}) {
    if (!this.enabled) return;

    // Add common properties
    const eventData = {
      ...properties,
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      user_id: this.userId,
      app_version: env.APP_VERSION,
      url: window.location.pathname,
    };

    // In a real app, this would send to an analytics service
    // For now, just log to console in development
    if (env.isDev) {
      console.log(`[Analytics] ${eventName}`, eventData);
    } else {
      // In production, this would send to an actual analytics service
      // analytics.send(eventName, eventData);
    }
  }

  pageView(pageName: string) {
    this.track('page_view', { page_name: pageName });
  }

  error(errorMessage: string, errorCode?: string) {
    this.track('error_encountered', { 
      error_message: errorMessage,
      error_code: errorCode || 'unknown'
    });
  }
}

export const analytics = new AnalyticsService();
export default analytics;
