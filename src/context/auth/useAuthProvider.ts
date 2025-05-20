
import { useAuthState } from './hooks/useAuthState';
import { useAuthListener } from './hooks/useAuthListener';
import { useAuthActions } from './hooks/useAuthActions';
import { User } from '@/types/user';

export function useAuthProvider() {
  // Set up auth state
  const { authState, setAuthState, setAuthError, clearAuthError } = useAuthState();
  
  // Destructure for cleaner usage throughout the component
  const { user, session, isLoading, authError, isAuthenticated } = authState;

  // Set up auth state listener
  useAuthListener(setAuthState);

  // Set up auth actions
  const { login, signup, logout, switchRole, requestReview } = useAuthActions(
    authState, 
    setAuthState, 
    setAuthError
  );

  // Set user and loading functions
  const setUser = (newUser: User | null) => {
    setAuthState(prev => ({
      ...prev,
      user: newUser,
      isAuthenticated: !!newUser
    }));
  };

  const setLoading = (loading: boolean) => {
    setAuthState(prev => ({
      ...prev,
      isLoading: loading
    }));
  };

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
    isAuthenticated,
    setUser,
    setLoading
  };
}
