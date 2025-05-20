
import { User, UserRole } from '@/types';
import { supabase } from "@/integrations/supabase/client";

/**
 * Handles user signup with email, password, name, and role
 */
export const signupUser = async (
  email: string, 
  password: string, 
  name: string, 
  role: UserRole = 'employee'
): Promise<{ 
  success: boolean; 
  user?: User;
  error?: string;
}> => {
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
      return { 
        success: false, 
        error: error.message || 'Failed to create account' 
      };
    }
    
    // The trigger we set up will create a profile and assign the default role
    
    if (!data.user) {
      return { success: false, error: 'Failed to create user' };
    }
    
    const newUser: User = {
      id: data.user.id,
      name,
      email,
      role,
      profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    };
    
    return { success: true, user: newUser };
  } catch (error: any) {
    console.error('Signup error:', error);
    return { 
      success: false, 
      error: error.message || 'An unexpected error occurred during signup' 
    };
  }
};
