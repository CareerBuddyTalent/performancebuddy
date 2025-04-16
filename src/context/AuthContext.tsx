import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { users, currentUser as defaultUser } from '@/data/mockData';
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        
        if (session && session.user) {
          try {
            const { data: userRoles, error: roleError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();

            if (roleError && roleError.code !== 'PGRST116') {
              console.error('Error fetching user role:', roleError);
            }

            const role = userRoles ? userRoles.role : 'employee';

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

    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          if (process.env.NODE_ENV === 'development') {
            setUser(defaultUser);
          }
          setIsLoading(false);
          return;
        }
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
      if (process.env.NODE_ENV === 'development') {
        const demoUser = users.find(u => u.email === email && password === 'password123');
        
        if (demoUser) {
          setUser(demoUser);
          setIsLoading(false);
          return true;
        }
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        setIsLoading(false);
        return false;
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole = 'employee'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role
          }
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        setIsLoading(false);
        return false;
      }
      
      if (process.env.NODE_ENV === 'development') {
        const newUser: User = {
          id: data.user?.id || '',
          name,
          email,
          role,
          profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
        };
        users.push(newUser);
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      if (process.env.NODE_ENV === 'development') {
        setUser(null);
      }
    } catch (error) {
      console.error('Logout error:', error);
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

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, switchRole, isLoading }}>
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
