
import React, { createContext, useContext, ReactNode, useEffect, useState, useCallback, useMemo } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { SupabaseAuthContextType, AuthState } from './auth/types';
import { convertSupabaseUser } from './auth/userUtils';
import { createAuthService } from './auth/authService';
import { calculateSessionTimeLeft, shouldWarnAboutExpiry } from './auth/sessionUtils';

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export const SupabaseAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    sessionTimeLeft: null
  });
  
  const { logAuthEvent } = useSecurityAudit();
  const authService = useMemo(() => createAuthService(logAuthEvent), [logAuthEvent]);

  // Session timeout management
  useEffect(() => {
    if (!authState.session) {
      setAuthState(prev => ({ ...prev, sessionTimeLeft: null }));
      return;
    }

    const updateTimeLeft = () => {
      const timeLeft = calculateSessionTimeLeft(authState.session);
      setAuthState(prev => ({ ...prev, sessionTimeLeft: timeLeft }));

      if (shouldWarnAboutExpiry(timeLeft)) {
        console.warn('Session expiring soon, please save your work');
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000);

    return () => clearInterval(interval);
  }, [authState.session]);

  const refreshUser = useCallback(async () => {
    try {
      console.log('Refreshing user data');
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      if (supabaseUser) {
        const convertedUser = await convertSupabaseUser(supabaseUser);
        setAuthState(prev => ({ ...prev, user: convertedUser }));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, []);

  const handleLogin = useCallback(async (email: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      return await authService.login(email, password);
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, [authService]);

  const handleSignup = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      return await authService.signup(name, email, password);
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, [authService]);

  useEffect(() => {
    let mounted = true;
    console.log('Setting up auth state listener');

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, 'User ID:', session?.user?.id);
        
        if (!mounted) return;
        
        setAuthState(prev => ({ ...prev, session }));
        
        if (session?.user) {
          console.log('Valid session found, converting user');
          // Use setTimeout to prevent potential deadlocks and allow state to settle
          setTimeout(async () => {
            if (!mounted) return;
            
            try {
              const convertedUser = await convertSupabaseUser(session.user);
              if (mounted) {
                console.log('Setting converted user:', convertedUser.id);
                setAuthState(prev => ({ ...prev, user: convertedUser }));
              }
            } catch (error) {
              console.error('Error converting user (setting fallback):', error);
              if (mounted) {
                // Set a basic user object to maintain authentication state
                const fallbackUser: User = {
                  id: session.user.id,
                  email: session.user.email || '',
                  name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                  role: 'employee' as const,
                  profilePicture: undefined
                };
                setAuthState(prev => ({ ...prev, user: fallbackUser }));
              }
            } finally {
              if (mounted) {
                setAuthState(prev => ({ ...prev, isLoading: false }));
              }
            }
          }, 100);
        } else {
          console.log('No session found, clearing user');
          setAuthState(prev => ({ ...prev, user: null }));
          if (mounted) {
            setAuthState(prev => ({ ...prev, isLoading: false }));
          }
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id || 'No session');
      if (!mounted) return;
      
      if (session?.user) {
        setAuthState(prev => ({ ...prev, session }));
        convertSupabaseUser(session.user)
          .then(user => {
            if (mounted) {
              console.log('Initial session user set:', user.id);
              setAuthState(prev => ({ ...prev, user }));
            }
          })
          .catch(error => {
            console.error('Initial session conversion failed (using fallback):', error);
            if (mounted) {
              // Set fallback user to maintain auth state
              const fallbackUser: User = {
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                role: 'employee' as const,
                profilePicture: undefined
              };
              setAuthState(prev => ({ ...prev, user: fallbackUser }));
            }
          })
          .finally(() => {
            if (mounted) {
              setAuthState(prev => ({ ...prev, isLoading: false }));
            }
          });
      } else {
        if (mounted) {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      }
    });

    return () => {
      console.log('Cleaning up auth listener');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Improved isAuthenticated logic - prioritize session over user object
  const isAuthenticated = useMemo(() => {
    const hasValidSession = !!authState.session && !!authState.session.user;
    
    console.log('Auth state check - Session:', !!authState.session, 'User:', !!authState.user, 'Authenticated:', hasValidSession);
    
    // Consider authenticated if we have a valid session, even if user object is still loading
    return hasValidSession;
  }, [authState.session, authState.user]);

  const value: SupabaseAuthContextType = useMemo(() => ({
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated,
    logout: authService.logout,
    refreshUser,
    login: handleLogin,
    signup: handleSignup,
    resetPassword: authService.resetPassword,
    sessionTimeLeft: authState.sessionTimeLeft
  }), [authState, isAuthenticated, authService, refreshUser, handleLogin, handleSignup]);

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};
