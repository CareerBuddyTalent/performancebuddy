
import { User } from '@/types';
import { supabase } from "@/integrations/supabase/client";

/**
 * Handles user login with email and password
 */
export const loginUser = async (email: string, password: string): Promise<{ 
  success: boolean; 
  user?: User;
  error?: string;
}> => {
  try {
    console.log("Attempting login for:", email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Invalid email or password' 
      };
    }
    
    if (!data.user) {
      return { success: false, error: 'User not found' };
    }
    
    // Build the user object from Supabase response
    // The full user object will be built by the auth state listener
    const authUser: User = {
      id: data.user.id,
      name: data.user.user_metadata.full_name || data.user.email?.split('@')[0] || 'User',
      email: data.user.email || '',
      role: 'employee', // Default role, will be updated by auth state listener
      profilePicture: data.user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.email?.split('@')[0] || 'User')}&background=random`
    };
    
    return { success: true, user: authUser };
  } catch (error: any) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: error.message || 'An unexpected error occurred during login' 
    };
  }
};
