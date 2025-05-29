
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuditEvent {
  action: string;
  resource?: string;
  resourceId?: string;
  metadata?: Record<string, any>;
}

export function useSecurityAudit() {
  const logSecurityEvent = useCallback(async (event: AuditEvent) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // In production, this should go to a dedicated audit log table
      const auditEntry = {
        user_id: user.id,
        action: event.action,
        table_name: event.resource || 'unknown',
        record_id: event.resourceId,
        new_values: event.metadata,
        user_agent: navigator.userAgent,
        ip_address: null, // This would be captured server-side
      };

      await supabase.from('audit_log').insert(auditEntry);
    } catch (error) {
      // Silently fail to avoid disrupting user experience
      console.error('Failed to log security event:', error);
    }
  }, []);

  const logAuthEvent = useCallback(async (action: 'login' | 'logout' | 'signup' | 'password_reset', success: boolean) => {
    await logSecurityEvent({
      action: `auth_${action}`,
      resource: 'authentication',
      metadata: { success, timestamp: new Date().toISOString() }
    });
  }, [logSecurityEvent]);

  const logPermissionEvent = useCallback(async (action: string, resource: string, granted: boolean) => {
    await logSecurityEvent({
      action: 'permission_check',
      resource,
      metadata: { 
        permission_action: action, 
        granted, 
        timestamp: new Date().toISOString() 
      }
    });
  }, [logSecurityEvent]);

  const logDataAccess = useCallback(async (resource: string, resourceId: string, action: 'read' | 'write' | 'delete') => {
    await logSecurityEvent({
      action: `data_${action}`,
      resource,
      resourceId,
      metadata: { timestamp: new Date().toISOString() }
    });
  }, [logSecurityEvent]);

  return {
    logSecurityEvent,
    logAuthEvent,
    logPermissionEvent,
    logDataAccess
  };
}
