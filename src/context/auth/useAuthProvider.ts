
import { useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '@/types';
import { users } from '@/data/mockData';
import { supabase } from "@/integrations/supabase/client";
import { AuthState } from './types';
import { 
  loginUser, 
  signupUser, 
  logoutUser, 
  requestReview as requestUserReview 
} from './utils/authOperations';

export function useAuthProvider() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    authError: null
  });

  // Destructure for cleaner usage throughout the component
  const { user, session, isLoading, authError } = authState;

  // Set up auth state listener
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener FIRST to prevent missed events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession ? "session exists" : "no session");
        
        if (currentSession?.user) {
          const authUser: User = {
            id: currentSession.user.id,
            name: currentSession.user.user_metadata.full_name || 
                  currentSession.user.email?.split('@')[0] || 
                  'User',
            email: currentSession.user.email || '',
            role: (currentSession.user.user_metadata.role || 'employee') as UserRole,
            profilePicture: currentSession.user.user_metadata.avatar_url,
          };
          
          // Update both session and user in a single state update
          setAuthState(prev => ({
            ...prev,
            user: authUser,
            session: currentSession,
            isLoading: false
          }));
          
          // Store session for development if needed
          if (process.env.NODE_ENV === 'development') {
            localStorage.setItem('authUser', JSON.stringify(authUser));
          }
        } else {
          // In development, check localStorage for a stored user
          if (process.env.NODE_ENV === 'development') {
            const storedUser = localStorage.getItem('authUser');
            if (storedUser) {
              try {
                setAuthState(prev => ({
                  ...prev,
                  user: JSON.parse(storedUser),
                  session: null,
                  isLoading: false
                }));
              } catch (e) {
                console.error('Error parsing stored user:', e);
                setAuthState(prev => ({
                  ...prev,
                  user: null,
                  session: null,
                  isLoading: false
                }));
              }
            } else {
              setAuthState(prev => ({
                ...prev,
                user: null,
                session: null,
                isLoading: false
              }));
            }
          } else {
            setAuthState(prev => ({
              ...prev,
              user: null,
              session: null,
              isLoading: false
            }));
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial session check:", initialSession ? "session exists" : "no session");
      
      if (initialSession?.user) {
        const authUser: User = {
          id: initialSession.user.id,
          name: initialSession.user.user_metadata.full_name || 
                initialSession.user.email?.split('@')[0] || 
                'User',
          email: initialSession.user.email || '',
          role: (initialSession.user.user_metadata.role || 'employee') as UserRole,
          profilePicture: initialSession.user.user_metadata.avatar_url,
        };
        
        setAuthState(prev => ({
          ...prev,
          user: authUser,
          session: initialSession,
          isLoading: false
        }));
        
        // Store user for development mode persistence
        if (process.env.NODE_ENV === 'development') {
          localStorage.setItem('authUser', JSON.stringify(authUser));
        }
      } else if (process.env.NODE_ENV === 'development') {
        // Try localStorage in development mode if no active session
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
          try {
            setAuthState(prev => ({
              ...prev,
              user: JSON.parse(storedUser),
              isLoading: false
            }));
          } catch (e) {
            console.error('Error parsing stored user:', e);
            setAuthState(prev => ({
              ...prev,
              user: null,
              isLoading: false
            }));
          }
        } else {
          setAuthState(prev => ({
            ...prev,
            isLoading: false
          }));
        }
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false
        }));
      }
    });

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setAuthError = useCallback((error: string | null) => {
    setAuthState(prev => ({
      ...prev,
      authError: error
    }));
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, authError: null }));
      
      const { success, user: loggedInUser, error } = await loginUser(email, password);
      
      if (success && loggedInUser) {
        console.log("Login successful for user:", loggedInUser);
        
        // Session will be updated by onAuthStateChange listener
        
        if (process.env.NODE_ENV === 'development') {
          localStorage.setItem('authUser', JSON.stringify(loggedInUser));
        }
        return true;
      }
      
      if (error) {
        console.error("Login error:", error);
        setAuthError(error);
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setAuthError('An unexpected error occurred during login');
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole = 'employee'): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, authError: null }));
      
      const { success, user: newUser, error } = await signupUser(email, password, name, role);
      
      if (success && newUser) {
        // Session will be updated by onAuthStateChange listener
        
        if (process.env.NODE_ENV === 'development') {
          localStorage.setItem('authUser', JSON.stringify(newUser));
        }
        return true;
      }
      
      if (error) {
        setAuthError(error);
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    } catch (error) {
      setAuthError('An unexpected error occurred during signup');
      console.error('Signup error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = async () => {
    try {
      setAuthError(null);
      await logoutUser();
      
      // Clear user from state and localStorage
      // Session will be cleared by onAuthStateChange listener
      localStorage.removeItem('authUser');
    } catch (error) {
      setAuthError('An error occurred during logout');
      console.error('Logout error:', error);
    }
  };

  const switchRole = (role: UserRole) => {
    console.log("Switching to role:", role);
    const roleUsers = {
      employee: users.find(u => u.role === 'employee'),
      manager: users.find(u => u.role === 'manager'),
      admin: users.find(u => u.role === 'admin')
    };

    const userForRole = roleUsers[role] || users[0];
    console.log("User for role:", userForRole);
    
    setAuthState(prev => ({
      ...prev,
      user: userForRole
    }));
    
    // Update localStorage to persist the role change
    if (process.env.NODE_ENV === 'development' && userForRole) {
      localStorage.setItem('authUser', JSON.stringify(userForRole));
    }
  };

  const requestReview = async (managerId: string, comments?: string): Promise<boolean> => {
    try {
      if (!user) return false;
      
      setAuthState(prev => ({ ...prev, isLoading: true, authError: null }));
      
      const success = await requestUserReview(user.id, managerId, comments);
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      setAuthError('An error occurred while requesting review');
      console.error('Review request error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, [setAuthError]);

  return {
    user,
    session,
    login,
    signup,
    logout,
    switchRole,
    isLoading,
    requestReview,
    authError,
    clearAuthError
  };
}
