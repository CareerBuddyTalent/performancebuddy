
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
      console.log('Converting Supabase user:', supabaseUser.id);
      
      // Get user profile from profiles table with better error handling
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (profileError) {
        console.warn('Profile fetch error (will create profile):', profileError);
      }

      // Create profile if it doesn't exist
      if (!profile) {
        console.log('Creating missing profile for user:', supabaseUser.id);
        const newProfile = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User'
        };

        const { data: createdProfile, error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (insertError) {
          console.error('Profile creation failed:', insertError);
          // Continue with fallback data instead of failing completely
        } else {
          console.log('Profile created successfully:', createdProfile);
        }
      }

      // Get user role from user_roles table
      const { data: userRole, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', supabaseUser.id)
        .maybeSingle();

      if (roleError) {
        console.warn('Role fetch error (will create default role):', roleError);
      }

      // Create default role if it doesn't exist
      if (!userRole) {
        console.log('Creating default role for user:', supabaseUser.id);
        const { error: roleInsertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: supabaseUser.id,
            role: 'employee'
          });

        if (roleInsertError) {
          console.error('Role creation failed:', roleInsertError);
          // Continue with default role instead of failing
        } else {
          console.log('Default role created successfully');
        }
      }

      // Always return a valid user object
      const convertedUser: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: (profile?.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User'),
        role: (userRole?.role as 'admin' | 'manager' | 'employee') || 'employee',
        profilePicture: profile?.avatar_url || profile?.profile_picture
      };

      console.log('Successfully converted user:', convertedUser.id, 'with role:', convertedUser.role);
      return convertedUser;
      
    } catch (error) {
      console.error('Error in convertSupabaseUser (using fallback):', error);
      
      // Return basic user info as fallback
      const fallbackUser: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
        role: 'employee' as const,
        profilePicture: undefined
      };
      
      console.log('Using fallback user data:', fallbackUser);
      return fallbackUser;
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
      console.log('Starting signup process for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name.trim()
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('Signup error:', error.message);
        await logAuthEvent('signup', false, { error: error.message });
        return false;
      }

      if (data.user) {
        console.log('Signup successful for user:', data.user.id);
        await logAuthEvent('signup', true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Signup failed:', error);
      await logAuthEvent('signup', false, { error: 'Unexpected error' });
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
      console.log('Logging out user');
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
      console.log('Refreshing user data');
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
    console.log('Setting up auth state listener');

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, 'User ID:', session?.user?.id);
        
        if (!mounted) return;
        
        setSession(session);
        
        if (session?.user) {
          console.log('Valid session found, converting user');
          // Use setTimeout to prevent potential deadlocks and allow state to settle
          setTimeout(async () => {
            if (!mounted) return;
            
            try {
              const convertedUser = await convertSupabaseUser(session.user);
              if (mounted) {
                console.log('Setting converted user:', convertedUser.id);
                setUser(convertedUser);
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
                setUser(fallbackUser);
              }
            } finally {
              if (mounted) {
                setIsLoading(false);
              }
            }
          }, 100);
        } else {
          console.log('No session found, clearing user');
          setUser(null);
          if (mounted) {
            setIsLoading(false);
          }
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id || 'No session');
      if (!mounted) return;
      
      if (session?.user) {
        setSession(session);
        convertSupabaseUser(session.user)
          .then(user => {
            if (mounted) {
              console.log('Initial session user set:', user.id);
              setUser(user);
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
              setUser(fallbackUser);
            }
          })
          .finally(() => {
            if (mounted) {
              setIsLoading(false);
            }
          });
      } else {
        if (mounted) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      console.log('Cleaning up auth listener');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [convertSupabaseUser]);

  // Improved isAuthenticated logic - prioritize session over user object
  const isAuthenticated = useMemo(() => {
    const hasValidSession = !!session && !!session.user;
    
    console.log('Auth state check - Session:', !!session, 'User:', !!user, 'Authenticated:', hasValidSession);
    
    // Consider authenticated if we have a valid session, even if user object is still loading
    return hasValidSession;
  }, [session, user]);

  const value: SupabaseAuthContextType = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated,
    logout,
    refreshUser,
    login,
    signup,
    resetPassword,
    sessionTimeLeft
  }), [user, isLoading, isAuthenticated, logout, refreshUser, login, signup, resetPassword, sessionTimeLeft]);

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
