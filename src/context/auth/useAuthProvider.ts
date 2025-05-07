
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { users } from '@/data/mockData';
import { supabase } from "@/integrations/supabase/client";
import { 
  loginUser, 
  signupUser, 
  logoutUser, 
  requestReview as requestUserReview 
} from './utils/authOperations';

export function useAuthProvider() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null); // Store full session object
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST (prevent missed events)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession ? "session exists" : "no session");
        
        setSession(currentSession);
        
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
          
          setUser(authUser);
          
          // Store session for development if needed
          if (process.env.NODE_ENV === 'development') {
            localStorage.setItem('authUser', JSON.stringify(authUser));
          }
        } else {
          // Only in development, check localStorage for a stored user
          if (process.env.NODE_ENV === 'development') {
            const storedUser = localStorage.getItem('authUser');
            if (storedUser) {
              try {
                setUser(JSON.parse(storedUser));
              } catch (e) {
                console.error('Error parsing stored user:', e);
                setUser(null);
              }
            } else {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial session check:", initialSession ? "session exists" : "no session");
      
      setSession(initialSession);
      
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
        
        setUser(authUser);
        
        // Store user for development mode persistence
        if (process.env.NODE_ENV === 'development') {
          localStorage.setItem('authUser', JSON.stringify(authUser));
        }
      } else if (process.env.NODE_ENV === 'development') {
        // Try localStorage in development mode if no active session
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error('Error parsing stored user:', e);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const { success, user: loggedInUser, error } = await loginUser(email, password);
      
      if (success && loggedInUser) {
        console.log("Login successful for user:", loggedInUser);
        setUser(loggedInUser);
        
        // Store user data in localStorage for development persistence
        if (process.env.NODE_ENV === 'development') {
          localStorage.setItem('authUser', JSON.stringify(loggedInUser));
        }
        return true;
      }
      
      if (error) {
        console.error("Login error:", error);
        setAuthError(error);
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setAuthError('An unexpected error occurred during login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole = 'employee'): Promise<boolean> => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      const { success, user: newUser, error } = await signupUser(email, password, name, role);
      
      if (success && newUser) {
        setUser(newUser);
        // Store user data in localStorage for persistence
        if (process.env.NODE_ENV === 'development') {
          localStorage.setItem('authUser', JSON.stringify(newUser));
        }
        return true;
      }
      
      if (error) {
        setAuthError(error);
      }
      
      return false;
    } catch (error) {
      setAuthError('An unexpected error occurred during signup');
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setAuthError(null);
      await logoutUser();
      
      // Clear user from state and localStorage
      setUser(null);
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
    setUser(userForRole);
    
    // Update localStorage to persist the role change
    if (process.env.NODE_ENV === 'development' && userForRole) {
      localStorage.setItem('authUser', JSON.stringify(userForRole));
    }
  };

  const requestReview = async (managerId: string, comments?: string): Promise<boolean> => {
    try {
      if (!user) return false;
      
      setIsLoading(true);
      setAuthError(null);
      
      const success = await requestUserReview(user.id, managerId, comments);
      return success;
    } catch (error) {
      setAuthError('An error occurred while requesting review');
      console.error('Review request error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
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
    clearAuthError
  };
}
