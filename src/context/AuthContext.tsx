
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { users, currentUser as defaultUser } from '@/data/mockData';
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        
        if (session && session.user) {
          try {
            // Check if user has a role in our system
            const { data: userRoles, error: roleError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();

            if (roleError && roleError.code !== 'PGRST116') {
              console.error('Error fetching user role:', roleError);
            }

            // If user has no role, default to 'employee'
            const role = userRoles ? userRoles.role : 'employee';

            // Create user object for our context
            const appUser: User = {
              id: session.user.id,
              name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              role: role as UserRole,
              profilePicture: session.user.user_metadata.avatar_url,
            };

            setUser(appUser);
          } catch (error) {
            console.error('Error setting up user:', error);
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        // If no session, we can stop loading
        if (!data.session) {
          // For demo purposes, still set default user in dev environment
          if (process.env.NODE_ENV === 'development') {
            setUser(defaultUser);
          }
          setIsLoading(false);
          return;
        }
        
        // Auth state change listener will handle setting the user
      } catch (error) {
        console.error('Session check error:', error);
        setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would validate against Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        setIsLoading(false);
        return false;
      }
      
      // User will be set by the auth state change listener
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // User will be set to null by the auth state change listener
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // For demo purposes - allows switching between roles
  const switchRole = (role: UserRole) => {
    const roleUsers = {
      employee: users.find(u => u.role === 'employee'),
      manager: users.find(u => u.role === 'manager'),
      admin: users.find(u => u.role === 'admin')
    };

    const userForRole = roleUsers[role] || users[0];
    setUser(userForRole);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
