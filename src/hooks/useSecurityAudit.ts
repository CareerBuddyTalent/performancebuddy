
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  action: 'login' | 'logout' | 'signup' | 'password_reset' | 'failed_login' | 'suspicious_activity';
  success: boolean;
  metadata?: Record<string, any>;
}

export function useSecurityAudit() {
  const logAuthEvent = useCallback(async (action: SecurityEvent['action'], success: boolean, metadata?: Record<string, any>) => {
    try {
      // Only log in production or when explicitly enabled
      if (process.env.NODE_ENV === 'development' && !import.meta.env.VITE_ENABLE_AUDIT_LOGS) {
        return;
      }

      const { error } = await supabase
        .from('audit_log')
        .insert({
          action,
          table_name: 'auth',
          record_id: null,
          user_id: (await supabase.auth.getUser()).data.user?.id || 'anonymous',
          old_values: null,
          new_values: { success, ...metadata },
          user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
        });

      if (error) {
        console.error('Failed to log security event:', error);
      }
    } catch (err) {
      console.error('Security audit logging failed:', err);
    }
  }, []);

  const logDataAccess = useCallback(async (tableName: string, action: string, recordId?: string) => {
    try {
      if (process.env.NODE_ENV === 'development') return;

      const { error } = await supabase
        .from('audit_log')
        .insert({
          action: `data_${action}`,
          table_name: tableName,
          record_id: recordId || null,
          user_id: (await supabase.auth.getUser()).data.user?.id || 'anonymous',
          old_values: null,
          new_values: { timestamp: new Date().toISOString() },
          user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
        });

      if (error) {
        console.error('Failed to log data access:', error);
      }
    } catch (err) {
      console.error('Data access logging failed:', err);
    }
  }, []);

  const logPermissionEvent = useCallback(async (resource: string, action: string, granted: boolean, metadata?: Record<string, any>) => {
    try {
      if (process.env.NODE_ENV === 'development' && !import.meta.env.VITE_ENABLE_AUDIT_LOGS) {
        return;
      }

      const { error } = await supabase
        .from('audit_log')
        .insert({
          action: `permission_${action}`,
          table_name: resource,
          record_id: null,
          user_id: (await supabase.auth.getUser()).data.user?.id || 'anonymous',
          old_values: null,
          new_values: { granted, ...metadata },
          user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
        });

      if (error) {
        console.error('Failed to log permission event:', error);
      }
    } catch (err) {
      console.error('Permission audit logging failed:', err);
    }
  }, []);

  return {
    logAuthEvent,
    logDataAccess,
    logPermissionEvent,
  };
}
