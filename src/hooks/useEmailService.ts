
import { supabase } from '@/integrations/supabase/client';

export interface NotificationEmailData {
  email: string;
  name: string;
  title: string;
  message: string;
  type: 'review_reminder' | 'goal_deadline' | 'feedback_received' | 'survey_reminder' | 'cycle_started' | 'general';
  actionUrl?: string;
  actionText?: string;
}

export interface PasswordResetEmailData {
  email: string;
  name: string;
  resetLink: string;
}

export interface WelcomeEmailData {
  email: string;
  name: string;
}

export function useEmailService() {
  const sendWelcomeEmail = async (data: WelcomeEmailData) => {
    try {
      const { error } = await supabase.functions.invoke('send-welcome-email', {
        body: data,
      });

      if (error) {
        console.error('Error sending welcome email:', error);
        throw error;
      }

      console.log('Welcome email sent successfully');
      return { success: true };
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      throw error;
    }
  };

  const sendPasswordResetEmail = async (data: PasswordResetEmailData) => {
    try {
      const { error } = await supabase.functions.invoke('send-password-reset-email', {
        body: data,
      });

      if (error) {
        console.error('Error sending password reset email:', error);
        throw error;
      }

      console.log('Password reset email sent successfully');
      return { success: true };
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw error;
    }
  };

  const sendNotificationEmail = async (data: NotificationEmailData) => {
    try {
      const { error } = await supabase.functions.invoke('send-notification-email', {
        body: data,
      });

      if (error) {
        console.error('Error sending notification email:', error);
        throw error;
      }

      console.log('Notification email sent successfully');
      return { success: true };
    } catch (error) {
      console.error('Failed to send notification email:', error);
      throw error;
    }
  };

  return {
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendNotificationEmail,
  };
}
