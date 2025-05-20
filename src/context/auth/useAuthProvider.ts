
import { useState, useEffect } from "react";
import { supabaseClient as supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { Session } from "@supabase/supabase-js";
import { AuthContextType } from "./types";

export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Handle auth state changes
  useEffect(() => {
    // First establish the auth listener to avoid missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        setSession(currentSession);
        
        if (currentSession?.user) {
          const userData: User = {
            id: currentSession.user.id,
            email: currentSession.user.email || "",
            name: currentSession.user.user_metadata.full_name || 
                 currentSession.user.email?.split("@")[0] || "User",
            role: "employee", // Default role, will be updated below
            profilePicture: currentSession.user.user_metadata.avatar_url,
          };
          
          // Update the user data with the role from the database
          // Using setTimeout to avoid deadlock in Auth state changes
          setTimeout(async () => {
            try {
              const { data, error } = await supabase
                .from("user_roles")
                .select("role")
                .eq("user_id", currentSession.user.id)
                .single();
                
              if (data && !error) {
                setUser({ ...userData, role: data.role });
              } else {
                setUser(userData);
              }
            } catch (error) {
              console.error("Error fetching user role:", error);
              setUser(userData);
            }
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      
      if (initialSession?.user) {
        const userData: User = {
          id: initialSession.user.id,
          email: initialSession.user.email || "",
          name: initialSession.user.user_metadata.full_name || 
               initialSession.user.email?.split("@")[0] || "User",
          role: "employee", // Default role, will be updated below
          profilePicture: initialSession.user.user_metadata.avatar_url,
        };
        
        // Fetch user role
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", initialSession.user.id)
          .single()
          .then(({ data, error }) => {
            if (data && !error) {
              setUser({ ...userData, role: data.role });
            } else {
              // If no role found, use default
              setUser(userData);
            }
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching user role:", error);
            setUser(userData);
            setIsLoading(false);
          });
      } else {
        // For development convenience, use mock user when not in production
        if (process.env.NODE_ENV === "development") {
          const storedUser = localStorage.getItem("authUser");
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (error) {
              console.error("Error parsing stored user:", error);
              setUser(null);
            }
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const login = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };
  
  const signup = async (email: string, password: string, userData?: Record<string, any>) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
  };
  
  const logout = async () => {
    return supabase.auth.signOut();
  };

  return {
    user,
    session,
    login,
    signup,
    logout,
    isLoading,
  };
};
