
import { useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '@/types';
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
    authError: null,
    isAuthenticated: false
  });

  // Destructure for cleaner usage throughout the component
  const { user, session, isLoading, authError, isAuthenticated } = authState;

  // Set up auth state listener
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener FIRST to prevent missed events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession ? "session exists" : "no session");
        
        if (currentSession?.user) {
          try {
            // Get user role from user_roles table
            const { data: userRole, error: roleError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', currentSession.user.id)
              .single();

            if (roleError && roleError.code !== 'PGRST116') {
              console.error("Error fetching user role:", roleError);
            }

            // Get user profile data from profiles table
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('name, email, department, position, profile_picture')
              .eq('id', currentSession.user.id)
              .single();

            if (profileError && profileError.code !== 'PGRST116') {
              console.error("Error fetching user profile:", profileError);
            }

            const role = userRole?.role || 'employee';
            const name = profileData?.name || currentSession.user.user_metadata.full_name || currentSession.user.email?.split('@')[0] || 'User';

            const authUser: User = {
              id: currentSession.user.id,
              name: name,
              email: currentSession.user.email || '',
              role: role as UserRole,
              profilePicture: profileData?.profile_picture || 
                             currentSession.user.user_metadata.avatar_url || 
                             `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
              department: profileData?.department,
              position: profileData?.position
            };
            
            // Update both session and user in a single state update
            setAuthState(prev => ({
              ...prev,
              user: authUser,
              session: currentSession,
              isLoading: false,
              isAuthenticated: true
            }));
          } catch (error) {
            console.error("Error setting up authenticated user:", error);
            setAuthState(prev => ({
              ...prev,
              isLoading: false
            }));
          }
        } else {
          // No session, clear the authentication state
          setAuthState(prev => ({
            ...prev,
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false
          }));
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial session check:", initialSession ? "session exists" : "no session");
      
      if (!initialSession) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          isAuthenticated: false
        }));
      }
      // If session exists, the onAuthStateChange handler will set the user
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
      
      // Explicitly set authenticated state to false
      setAuthState(prev => ({
        ...prev,
        user: null,
        session: null,
        isAuthenticated: false
      }));
    } catch (error) {
      setAuthError('An error occurred during logout');
      console.error('Logout error:', error);
    }
  };

  // Implementing the missing switchRole function
  const switchRole = useCallback((role: UserRole) => {
    if (!user) return;
    
    setAuthState(prev => {
      if (!prev.user) return prev;
      
      const updatedUser = {
        ...prev.user,
        role
      };
      
      return {
        ...prev,
        user: updatedUser
      };
    });
    
    // Optional: Update the role in database if needed
    // This is just updating the local state for now
    console.log(`Switched role to: ${role} for user: ${user.email}`);
  }, [user]);

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
    clearAuthError,
    isAuthenticated
  };
}
