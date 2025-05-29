
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';

interface SecurityContextType {
  isSecure: boolean;
  logAccess: (resource: string, action: string) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useSupabaseAuth();
  const { logDataAccess, logPermissionEvent } = useSecurityAudit();

  useEffect(() => {
    // Set up security headers and CSP if possible
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';";
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const logAccess = async (resource: string, action: string) => {
    if (user) {
      await logDataAccess(resource, user.id, action as 'read' | 'write' | 'delete');
    }
  };

  const value: SecurityContextType = {
    isSecure: true,
    logAccess
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};
