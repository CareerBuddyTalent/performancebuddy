
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useEmailService } from '@/hooks/useEmailService';
import { toast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'review_due' | 'goal_overdue' | 'feedback_received' | 'cycle_started' | 'survey_reminder';
  title: string;
  message: string;
  actionUrl?: string;
  read: boolean;
  createdAt: Date;
}

interface EnhancedNotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  sendNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  sendEmailNotification: (notificationType: string, data: any) => Promise<void>;
}

const EnhancedNotificationContext = createContext<EnhancedNotificationContextType | undefined>(undefined);

export const useEnhancedNotificationSystem = () => {
  const context = useContext(EnhancedNotificationContext);
  if (!context) {
    throw new Error('useEnhancedNotificationSystem must be used within EnhancedNotificationProvider');
  }
  return context;
};

export function EnhancedNotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useSupabaseAuth();
  const { sendNotificationEmail } = useEmailService();
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
          title: 'Performance Reviews Due',
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
          title: 'Goals Approaching Deadline',
          message: `${overdueGoals.length} goal${overdueGoals.length > 1 ? 's are' : ' is'} approaching deadline.`,
          actionUrl: '/performance',
          read: false,
          createdAt: new Date()
        });
      }

      // Check for new feedback
      const { data: newFeedback } = await supabase
        .from('feedback')
        .select('id, content, created_at')
        .eq('recipient_id', user.id)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (newFeedback && newFeedback.length > 0) {
        newNotifications.push({
          id: 'new-feedback',
          type: 'feedback_received',
          title: 'New Feedback Received',
          message: `You have received ${newFeedback.length} new feedback message${newFeedback.length > 1 ? 's' : ''}.`,
          actionUrl: '/feedback',
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
      const interval = setInterval(checkForNotifications, 10 * 60 * 1000); // Check every 10 minutes
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

  const sendEmailNotification = async (notificationType: string, data: any) => {
    if (!user) return;

    try {
      const emailTypeMap = {
        review_reminder: {
          title: 'Performance Review Reminder',
          message: 'Your performance review is due soon. Please complete it at your earliest convenience.',
          actionText: 'Complete Review',
          actionUrl: 'https://performpath.app/reviews'
        },
        goal_deadline: {
          title: 'Goal Deadline Approaching',
          message: 'One or more of your goals are approaching their deadline. Please update your progress.',
          actionText: 'View Goals',
          actionUrl: 'https://performpath.app/performance'
        },
        feedback_received: {
          title: 'New Feedback Received',
          message: 'You have received new feedback from a colleague. Check it out to continue improving.',
          actionText: 'View Feedback',
          actionUrl: 'https://performpath.app/feedback'
        },
        survey_reminder: {
          title: 'Survey Reminder',
          message: 'You have pending surveys that need your attention. Your input is valuable to us.',
          actionText: 'Complete Surveys',
          actionUrl: 'https://performpath.app/surveys'
        },
        cycle_started: {
          title: 'New Performance Cycle Started',
          message: 'A new performance cycle has begun. Set your goals and start tracking your progress.',
          actionText: 'Get Started',
          actionUrl: 'https://performpath.app/performance'
        }
      };

      const emailData = emailTypeMap[notificationType as keyof typeof emailTypeMap];
      
      if (emailData) {
        await sendNotificationEmail({
          email: user.email,
          name: user.name,
          title: emailData.title,
          message: emailData.message,
          type: notificationType as any,
          actionUrl: emailData.actionUrl,
          actionText: emailData.actionText,
        });
      }
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <EnhancedNotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      sendNotification,
      sendEmailNotification
    }}>
      {children}
    </EnhancedNotificationContext.Provider>
  );
}
