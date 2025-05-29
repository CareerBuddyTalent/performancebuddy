
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { toast } from 'sonner';

interface RealTimeNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  userId: string;
  createdAt: Date;
  read: boolean;
}

export function useRealTimeNotifications() {
  const { user } = useSupabaseAuth();
  const [notifications, setNotifications] = useState<RealTimeNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback((notification: Omit<RealTimeNotification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: RealTimeNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Show toast notification
    switch (notification.type) {
      case 'success':
        toast.success(notification.title, { description: notification.message });
        break;
      case 'warning':
        toast.warning(notification.title, { description: notification.message });
        break;
      case 'error':
        toast.error(notification.title, { description: notification.message });
        break;
      default:
        toast.info(notification.title, { description: notification.message });
    }

    return newNotification;
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  }, []);

  // Simulate real-time notifications for demo purposes
  useEffect(() => {
    if (!user) return;

    const simulateNotifications = () => {
      const sampleNotifications = [
        {
          title: "Review Reminder",
          message: "Your quarterly review is due in 3 days",
          type: 'warning' as const,
          userId: user.id
        },
        {
          title: "Goal Updated",
          message: "Your Q4 sales goal has been updated by your manager",
          type: 'info' as const,
          userId: user.id
        },
        {
          title: "Feedback Received",
          message: "You received new feedback from your peer review",
          type: 'success' as const,
          userId: user.id
        }
      ];

      // Add a random notification every 30 seconds for demo
      const interval = setInterval(() => {
        const randomNotification = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
        if (Math.random() > 0.7) { // 30% chance
          addNotification(randomNotification);
        }
      }, 30000);

      return () => clearInterval(interval);
    };

    const cleanup = simulateNotifications();
    return cleanup;
  }, [user, addNotification]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead
  };
}
