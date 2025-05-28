
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'review_due' | 'goal_overdue' | 'feedback_received' | 'cycle_started';
  title: string;
  message: string;
  actionUrl?: string;
  read: boolean;
  createdAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  sendNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationSystem = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationSystem must be used within NotificationProvider');
  }
  return context;
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useSupabaseAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const checkForNotifications = async () => {
    if (!user) return;

    const newNotifications: Notification[] = [];

    try {
      // Check for overdue reviews
      const { data: overdueReviews } = await supabase
        .from('performance_reviews')
        .select('id, cycle_id')
        .eq('employee_id', user.id)
        .eq('status', 'pending');

      if (overdueReviews && overdueReviews.length > 0) {
        newNotifications.push({
          id: 'overdue-reviews',
          type: 'review_due',
          title: 'Reviews Due',
          message: `You have ${overdueReviews.length} pending review${overdueReviews.length > 1 ? 's' : ''} to complete.`,
          actionUrl: '/performance/reviews',
          read: false,
          createdAt: new Date()
        });
      }

      // Check for overdue goals
      const { data: overdueGoals } = await supabase
        .from('goals')
        .select('id, title')
        .eq('user_id', user.id)
        .lt('due_date', new Date().toISOString())
        .neq('status', 'completed');

      if (overdueGoals && overdueGoals.length > 0) {
        newNotifications.push({
          id: 'overdue-goals',
          type: 'goal_overdue',
          title: 'Goals Overdue',
          message: `${overdueGoals.length} goal${overdueGoals.length > 1 ? 's are' : ' is'} past due date.`,
          actionUrl: '/performance',
          read: false,
          createdAt: new Date()
        });
      }

      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  useEffect(() => {
    if (user) {
      checkForNotifications();
      const interval = setInterval(checkForNotifications, 5 * 60 * 1000); // Check every 5 minutes
      return () => clearInterval(interval);
    }
  }, [user]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const sendNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      sendNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
