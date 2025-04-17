
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { users } from '@/data/mockData';
import { setupUserSession } from './utils/userSession';
import { 
  loginUser, 
  signupUser, 
  logoutUser, 
  requestReview as requestUserReview 
} from './utils/authOperations';

export function useAuthProvider() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = setupUserSession(setUser, setIsLoading);
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const { success, user: loggedInUser } = await loginUser(email, password);
    
    if (success && loggedInUser) {
      setUser(loggedInUser);
    }
    
    setIsLoading(false);
    return success;
  };

  const signup = async (email: string, password: string, name: string, role: UserRole = 'employee'): Promise<boolean> => {
    setIsLoading(true);
    const { success, user: newUser } = await signupUser(email, password, name, role);
    
    if (success && newUser) {
      setUser(newUser);
    }
    
    setIsLoading(false);
    return success;
  };

  const logout = async () => {
    await logoutUser();
    if (process.env.NODE_ENV === 'development') {
      setUser(null);
    }
  };

  const switchRole = (role: UserRole) => {
    const roleUsers = {
      employee: users.find(u => u.role === 'employee'),
      manager: users.find(u => u.role === 'manager'),
      admin: users.find(u => u.role === 'admin')
    };

    const userForRole = roleUsers[role] || users[0];
    setUser(userForRole);
  };

  const requestReview = async (managerId: string, comments?: string): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    const success = await requestUserReview(user.id, managerId, comments);
    setIsLoading(false);
    
    return success;
  };

  return {
    user,
    login,
    signup,
    logout,
    switchRole,
    isLoading,
    requestReview
  };
}
