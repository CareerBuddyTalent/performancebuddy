
import { useState, useEffect } from "react";
import { supabaseClient as supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { Session } from "@supabase/supabase-js";
import { AuthContextType } from "./types";

export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Handle auth state changes
  useEffect(() => {
    // First establish the auth listener to avoid missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        
        setSession(currentSession);
        setIsAuthenticated(!!currentSession?.user);
        
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
        } else {
          setUser(null);
        }
      }
    );

    // Initial session check
    const getInitialSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        setSession(initialSession);
        setIsAuthenticated(!!initialSession?.user);
        
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
          try {
            const { data, error } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", initialSession.user.id)
              .single();
              
            if (data && !error) {
              setUser({ ...userData, role: data.role });
            } else {
              // If no role found, use default
              setUser(userData);
            }
          } catch (error) {
            console.error("Error fetching user role:", error);
            setUser(userData);
          }
        } else {
          // For development convenience, use mock user when not in production
          if (process.env.NODE_ENV === "development") {
            const storedUser = localStorage.getItem("authUser");
            if (storedUser) {
              try {
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
              } catch (error) {
                console.error("Error parsing stored user:", error);
                setUser(null);
                setIsAuthenticated(false);
              }
            }
          } else {
            setUser(null);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error getting initial session:", error);
        setIsLoading(false);
        setIsAuthenticated(false);
      }
    };
    
    getInitialSession();

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
    isAuthenticated,
  };
};
