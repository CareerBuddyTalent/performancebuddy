
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useClerkAuth } from '@/context/ClerkAuthContext';
import { useLocation } from 'react-router-dom';
import analytics from '@/services/analytics';
import env from '@/config/env';

interface AnalyticsContextType {
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  trackEvent: () => {},
});

export const useAnalytics = () => useContext(AnalyticsContext);

export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useClerkAuth();
  const location = useLocation();
  
  // Initialize analytics with user when available
  useEffect(() => {
    if (user?.id) {
      analytics.setUser(user.id);
    } else {
      analytics.setUser(null);
    }
  }, [user]);
  
  // Track page views
  useEffect(() => {
    if (env.ENABLE_ANALYTICS) {
      const pageName = location.pathname.substring(1) || 'home';
      analytics.pageView(pageName);
    }
  }, [location]);
  
  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    analytics.track(eventName as any, properties);
  };
  
  return (
    <AnalyticsContext.Provider value={{ trackEvent }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
