
import React, { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import { useLocalStorage, useToggle } from 'react-use';
import { User } from '@/types';

interface EnhancedFallbackAuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
}

const EnhancedFallbackAuthContext = createContext<EnhancedFallbackAuthContextType | undefined>(undefined);

export const EnhancedFallbackAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('fallback_user', null);
  const [isLoading, toggleLoading] = useToggle(false);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    toggleLoading(true);
    try {
      // Simulate login - in a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: 'fallback_user_' + Date.now(),
        email,
        name: email.split('@')[0],
        role: 'employee',
        profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };
      
      setUser(mockUser);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      toggleLoading(false);
    }
  }, [setUser, toggleLoading]);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    toggleLoading(true);
    try {
      // Simulate signup - in a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: 'fallback_user_' + Date.now(),
        email,
        name,
        role: 'employee',
        profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
      };
      
      setUser(mockUser);
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    } finally {
      toggleLoading(false);
    }
  }, [setUser, toggleLoading]);

  const logout = useCallback(async () => {
    setUser(null);
  }, [setUser]);

  const refreshUser = useCallback(async () => {
    // In fallback mode, user is already synced with localStorage
    // No additional action needed due to useLocalStorage hook
  }, []);

  const value: EnhancedFallbackAuthContextType = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    refreshUser,
    login,
    signup
  }), [user, isLoading, logout, refreshUser, login, signup]);

  return (
    <EnhancedFallbackAuthContext.Provider value={value}>
      {children}
    </EnhancedFallbackAuthContext.Provider>
  );
};

export const useEnhancedFallbackAuth = () => {
  const context = useContext(EnhancedFallbackAuthContext);
  if (context === undefined) {
    throw new Error('useEnhancedFallbackAuth must be used within a EnhancedFallbackAuthProvider');
  }
  return context;
};
