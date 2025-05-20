
import { useCallback } from 'react';
import { User, UserRole } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { AuthState } from '../types';
import { 
  loginUser, 
  signupUser, 
  logoutUser, 
  requestReview as requestUserReview 
} from '../utils/authOperations';

/**
 * Hook for auth-related actions (login, logout, signup, etc.)
 */
export function useAuthActions(
  authState: AuthState,
  setAuthState: (updater: (prev: AuthState) => AuthState) => void,
  setAuthError: (error: string | null) => void
) {
  const { user } = authState;

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

  // Implementing the switchRole function to update user role both in state and optionally in database
  const switchRole = useCallback(async (role: UserRole) => {
    if (!user) return;
    
    // Update local state first for immediate UI feedback
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
    try {
      // This updates the user_roles table with the new role
      const { error } = await supabase
        .from('user_roles')
        .update({ role })
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error updating user role in database:', error);
      } else {
        console.log(`Successfully updated role to: ${role} for user: ${user.email}`);
      }
    } catch (error) {
      console.error('Error in switchRole function:', error);
    }
  }, [user, setAuthState]);

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

  return {
    login,
    signup,
    logout,
    switchRole,
    requestReview
  };
}
