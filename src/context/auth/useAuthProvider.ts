
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { users, currentUser as defaultUser } from '@/data/mockData';
import { v4 as uuidv4 } from 'uuid';

export function useAuthProvider() {
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
      
      // Send welcome email
      try {
        await supabase.functions.invoke('send-welcome-email', {
          body: { name, email }
        });
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Don't return false here, as the signup was successful
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

  const requestReview = async (managerId: string, comments?: string): Promise<boolean> => {
    try {
      if (!user) return false;

      setIsLoading(true);
      
      // In production, we would create a DB record here
      if (process.env.NODE_ENV === 'production') {
        const { error } = await supabase
          .from('review_requests')
          .insert({
            id: uuidv4(),
            employee_id: user.id,
            manager_id: managerId,
            comments: comments || '',
            status: 'pending',
            created_at: new Date()
          });
  
        if (error) {
          console.error('Error requesting review:', error);
          setIsLoading(false);
          return false;
        }
      } else {
        // Simulate API delay in development
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For development, we'll just log this
        console.log('Review requested with:', {
          employee_id: user.id,
          manager_id: managerId,
          comments: comments || '',
          status: 'pending'
        });
      }
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error requesting review:', error);
      setIsLoading(false);
      return false;
    }
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
