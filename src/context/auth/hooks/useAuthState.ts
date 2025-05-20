
import { useState } from 'react';
import { AuthState } from '../types';

/**
 * Hook for setting up and managing auth state
 */
export function useAuthState() {
  const initialState: AuthState = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    session: null,
    authError: null
  };
  
  const [authState, setAuthState] = useState<AuthState>(initialState);

  const setAuthError = (error: string | null) => {
    setAuthState(prev => ({
      ...prev,
      authError: error
    }));
  };

  const clearAuthError = () => {
    setAuthState(prev => ({
      ...prev,
      authError: null
    }));
  };

  return { 
    authState, 
    setAuthState, 
    setAuthError,
    clearAuthError
  };
}
