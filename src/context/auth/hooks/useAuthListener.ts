
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from '@/types';
import { AuthState } from '../types';

/**
 * Hook for setting up Supabase auth listener
 */
export function useAuthListener(
  setAuthState: (updater: (prev: AuthState) => AuthState) => void
) {
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener FIRST to prevent missed events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession ? "session exists" : "no session");
        
        if (currentSession?.user) {
          try {
            // Get user role from user_roles table
            const { data: userRole, error: roleError } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', currentSession.user.id)
              .single();

            if (roleError && roleError.code !== 'PGRST116') {
              console.error("Error fetching user role:", roleError);
            }

            // Get user profile data from profiles table
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('name, email, department, position, profile_picture')
              .eq('id', currentSession.user.id)
              .single();

            if (profileError && profileError.code !== 'PGRST116') {
              console.error("Error fetching user profile:", profileError);
            }

            const role = userRole?.role || 'employee';
            const name = profileData?.name || currentSession.user.user_metadata.full_name || currentSession.user.email?.split('@')[0] || 'User';

            const authUser: User = {
              id: currentSession.user.id,
              name: name,
              email: currentSession.user.email || '',
              role: role as UserRole,
              profilePicture: profileData?.profile_picture || 
                             currentSession.user.user_metadata.avatar_url || 
                             `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
              department: profileData?.department,
              position: profileData?.position
            };
            
            // Update both session and user in a single state update
            setAuthState(prev => ({
              ...prev,
              user: authUser,
              session: currentSession,
              isLoading: false,
              isAuthenticated: true
            }));
          } catch (error) {
            console.error("Error setting up authenticated user:", error);
            setAuthState(prev => ({
              ...prev,
              isLoading: false
            }));
          }
        } else {
          // No session, clear the authentication state
          setAuthState(prev => ({
            ...prev,
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false
          }));
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial session check:", initialSession ? "session exists" : "no session");
      
      if (!initialSession) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          isAuthenticated: false
        }));
      }
      // If session exists, the onAuthStateChange handler will set the user
    });

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [setAuthState]);
}
