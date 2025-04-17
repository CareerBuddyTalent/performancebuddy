
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { currentUser as defaultUser } from '@/data/mockData';

/**
 * Handles user session setup and state changes
 */
export const setupUserSession = (
  setUser: (user: User | null) => void,
  setIsLoading: (loading: boolean) => void
): (() => void) => {
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

  // Initial session check
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
};
