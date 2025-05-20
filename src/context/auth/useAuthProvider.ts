
import { useAuthState } from './hooks/useAuthState';
import { useAuthListener } from './hooks/useAuthListener';
import { useAuthActions } from './hooks/useAuthActions';

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
