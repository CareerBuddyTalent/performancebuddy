
import React, { useEffect } from 'react';
import { useClerkAuth } from '@/context/ClerkAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNotificationSystem } from '@/components/notifications/NotificationSystem';

export function ReminderSystem() {
  const { user } = useClerkAuth();
  const { sendNotification } = useNotificationSystem();

  useEffect(() => {
    if (!user) return;

    const checkReminders = async () => {
      try {
        // Check for upcoming review deadlines
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

        const { data: upcomingCycles } = await supabase
          .from('review_cycles')
          .select('*')
          .eq('status', 'active')
          .lt('end_date', threeDaysFromNow.toISOString())
          .gt('end_date', new Date().toISOString());

        if (upcomingCycles && upcomingCycles.length > 0) {
          upcomingCycles.forEach(cycle => {
            sendNotification({
              type: 'review_due',
              title: 'Review Deadline Approaching',
              message: `The review cycle "${cycle.name}" ends in 3 days. Please complete your reviews.`,
              actionUrl: '/performance/reviews'
            });
          });
        }

        // Check for goal progress updates needed
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const { data: staleGoals } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'in_progress')
          .lt('updated_at', oneWeekAgo.toISOString());

        if (staleGoals && staleGoals.length > 0) {
          sendNotification({
            type: 'goal_overdue',
            title: 'Goal Updates Needed',
            message: `${staleGoals.length} goal${staleGoals.length > 1 ? 's haven\'t' : ' hasn\'t'} been updated in a week.`,
            actionUrl: '/performance'
          });
        }

      } catch (error) {
        console.error('Error checking reminders:', error);
      }
    };

    // Check reminders on mount and then every hour
    checkReminders();
    const interval = setInterval(checkReminders, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, sendNotification]);

  return null; // This is a background service component
}
