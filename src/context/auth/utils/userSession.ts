
import { User, UserRole } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { currentUser as defaultUser, users } from '@/data/mockData';

/**
 * Handles user session setup and state changes
 */
export const setupUserSession = (
  setUser: (user: User | null) => void,
  setIsLoading: (loading: boolean) => void
): (() => void) => {
  console.log("Setting up user session...");
  
  // Set up auth state change listener
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log("Auth state changed:", event, "Session:", session ? "exists" : "null");
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

          console.log("Setting authenticated user:", appUser);
          setUser(appUser);
        } catch (error) {
          console.error('Error setting up user:', error);
        }
      } else {
        // In dev mode, try to get user from localStorage if no active session
        if (process.env.NODE_ENV === 'development') {
          const storedUser = localStorage.getItem('authUser');
          console.log("Development mode - Stored user in localStorage:", storedUser ? "exists" : "null");
          
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              console.log("Setting user from localStorage:", parsedUser);
              setUser(parsedUser);
            } catch (e) {
              console.error('Error parsing stored user:', e);
              console.log("Falling back to default user:", defaultUser);
              setUser(defaultUser);
            }
          } else {
            console.log("No stored user, setting default user:", defaultUser);
            setUser(defaultUser);
          }
        } else {
          console.log("Production mode - No active session, setting user to null");
          setUser(null);
        }
      }
      
      setIsLoading(false);
    }
  );

  // Initial session check
  const checkSession = async () => {
    console.log("Performing initial session check...");
    try {
      const { data } = await supabase.auth.getSession();
      console.log("Initial session check result:", data.session ? "Session exists" : "No session");
      
      if (!data.session) {
        if (process.env.NODE_ENV === 'development') {
          const storedUser = localStorage.getItem('authUser');
          console.log("No active session, checking localStorage:", storedUser ? "User found" : "No user");
          
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              console.log("Using user from localStorage:", parsedUser);
              setUser(parsedUser);
            } catch (e) {
              console.error('Error parsing stored user:', e);
              console.log("Falling back to default user");
              setUser(defaultUser);
            }
          } else {
            console.log("No stored user, using default user");
            setUser(defaultUser);
          }
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
    console.log("Cleaning up auth subscription");
    subscription.unsubscribe();
  };
};
