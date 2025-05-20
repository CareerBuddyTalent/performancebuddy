
import { useState } from 'react';
import { AuthState } from '../types';

/**
 * Hook for managing authentication state
 */
export function useAuthState() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    authError: null,
    isAuthenticated: false
  });

  const setAuthError = (error: string | null) => {
    setAuthState(prev => ({
      ...prev,
      authError: error
    }));
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  return {
    authState,
    setAuthState,
    setAuthError,
    clearAuthError
  };
}
