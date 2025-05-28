import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  type: 'announcement' | 'reminder' | 'achievement' | 'feedback';
  read: boolean;
}

export function useRealNotifications() {
  const { user } = useSupabaseAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        // Create notifications based on real data
        const notifications: Notification[] = [];

        // Get pending reviews
        const { data: reviews } = await supabase
          .from('performance_reviews')
          .select('*')
          .eq('employee_id', user.id)
          .eq('status', 'pending');

        if (reviews && reviews.length > 0) {
          notifications.push({
            id: 'pending-reviews',
            title: 'Performance Review Due',
            description: `You have ${reviews.length} pending performance review${reviews.length > 1 ? 's' : ''} to complete.`,
            createdAt: new Date(),
            type: 'reminder',
            read: false
          });
        }

        // Get overdue goals
        const { data: goals } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)
          .lt('due_date', new Date().toISOString())
          .neq('status', 'completed');

        if (goals && goals.length > 0) {
          notifications.push({
            id: 'overdue-goals',
            title: 'Goals Overdue',
            description: `You have ${goals.length} overdue goal${goals.length > 1 ? 's' : ''} that need attention.`,
            createdAt: new Date(),
            type: 'reminder',
            read: false
          });
        }

        // Get recent feedback
        const { data: feedback } = await supabase
          .from('feedback')
          .select('*')
          .eq('recipient_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (feedback && feedback.length > 0) {
          feedback.forEach((item, index) => {
            notifications.push({
              id: `feedback-${item.id}`,
              title: 'New Feedback Received',
              description: item.content.substring(0, 100) + (item.content.length > 100 ? '...' : ''),
              createdAt: new Date(item.created_at),
              type: 'feedback',
              read: false
            });
          });
        }

        // Add a welcome notification if no other notifications
        if (notifications.length === 0) {
          notifications.push({
            id: 'welcome',
            title: 'Welcome to CareerBuddy',
            description: 'Start by setting your goals and connecting with your team members.',
            createdAt: new Date(),
            type: 'announcement',
            read: false
          });
        }

        setNotifications(notifications);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching notifications:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  return {
    notifications,
    isLoading,
    error
  };
}
