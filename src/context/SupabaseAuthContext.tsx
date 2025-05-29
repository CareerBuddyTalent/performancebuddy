
import React, { createContext, useContext, ReactNode, useEffect, useState, useCallback, useMemo } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';

interface SupabaseAuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  sessionTimeLeft: number | null;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export const SupabaseAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimeLeft, setSessionTimeLeft] = useState<number | null>(null);
  const { logAuthEvent } = useSecurityAudit();

  const convertSupabaseUser = useCallback(async (supabaseUser: SupabaseUser): Promise<User> => {
    try {
      // Get user profile from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      }

      // Get user role from user_roles table
      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', supabaseUser.id)
        .single();

      if (roleError && roleError.code !== 'PGRST116') {
        console.error('Error fetching role:', roleError);
      }

      // Create or update profile if it doesn't exist
      if (!profile) {
        const newProfile = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User'
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile);

        if (insertError) {
          console.error('Error creating profile:', insertError);
        }
      }

      // Create default role if it doesn't exist
      if (!userRole) {
        const { error: roleInsertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: supabaseUser.id,
            role: 'employee'
          });

        if (roleInsertError) {
          console.error('Error creating user role:', roleInsertError);
        }
      }

      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: profile?.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
        role: (userRole?.role as 'admin' | 'manager' | 'employee') || 'employee',
        profilePicture: profile?.avatar_url || profile?.profile_picture
      };
    } catch (error) {
      console.error('Error in convertSupabaseUser:', error);
      // Return basic user info as fallback
      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
        role: 'employee' as const,
        profilePicture: undefined
      };
    }
  }, []);

  // Session timeout management
  useEffect(() => {
    if (!session) {
      setSessionTimeLeft(null);
      return;
    }

    const updateTimeLeft = () => {
      const expiresAt = session.expires_at ? session.expires_at * 1000 : Date.now() + (60 * 60 * 1000);
      const timeLeft = expiresAt - Date.now();
      setSessionTimeLeft(Math.max(0, timeLeft));

      if (timeLeft <= 5 * 60 * 1000 && timeLeft > 0) {
        console.warn('Session expiring soon, please save your work');
      }
    };

    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000);

    return () => clearInterval(interval);
  }, [session]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('Starting login process for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        await logAuthEvent('login', false, { error: error.message });
        return false;
      }

      if (data.user) {
        console.log('Login successful for user:', data.user.id);
        await logAuthEvent('login', true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login failed:', error);
      await logAuthEvent('login', false, { error: 'Unexpected error' });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [logAuthEvent]);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name.trim()
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        await logAuthEvent('signup', false);
        return false;
      }

      if (data.user) {
        await logAuthEvent('signup', true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Signup failed:', error);
      await logAuthEvent('signup', false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [logAuthEvent]);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/reset-password`
        }
      );
      
      if (error) {
        console.error('Password reset error:', error);
        await logAuthEvent('password_reset', false);
        return false;
      }

      await logAuthEvent('password_reset', true);
      return true;
    } catch (error) {
      console.error('Password reset failed:', error);
      await logAuthEvent('password_reset', false);
      return false;
    }
  }, [logAuthEvent]);

  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      await logAuthEvent('logout', true);
    } catch (error) {
      console.error('Logout failed:', error);
      await logAuthEvent('logout', false);
    }
  }, [logAuthEvent]);

  const refreshUser = useCallback(async () => {
    try {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      if (supabaseUser) {
        const convertedUser = await convertSupabaseUser(supabaseUser);
        setUser(convertedUser);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, [convertSupabaseUser]);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (!mounted) return;
        
        setSession(session);
        
        if (session?.user) {
          // Use setTimeout to prevent potential deadlocks
          setTimeout(async () => {
            if (!mounted) return;
            
            try {
              const convertedUser = await convertSupabaseUser(session.user);
              if (mounted) {
                setUser(convertedUser);
              }
            } catch (error) {
              console.error('Error converting user:', error);
              if (mounted) {
                setUser(null);
              }
            }
          }, 0);
        } else {
          setUser(null);
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      if (session?.user) {
        convertSupabaseUser(session.user)
          .then(user => mounted && setUser(user))
          .catch(() => mounted && setUser(null));
      }
      if (mounted) {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [convertSupabaseUser]);

  const value: SupabaseAuthContextType = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!session && !!user,
    logout,
    refreshUser,
    login,
    signup,
    resetPassword,
    sessionTimeLeft
  }), [user, isLoading, session, logout, refreshUser, login, signup, resetPassword, sessionTimeLeft]);

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
