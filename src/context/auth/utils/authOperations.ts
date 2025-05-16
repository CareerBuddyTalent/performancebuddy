
import { User, UserRole } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

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
    
    // For production - use Supabase authentication
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

/**
 * Handles user logout
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Requests a performance review from a manager
 */
export const requestReview = async (
  userId: string,
  managerId: string, 
  comments?: string
): Promise<boolean> => {
  try {
    if (!userId) return false;
    
    // In production, we would create a DB record here
    const { error } = await supabase
      .from('review_requests' as any) // Using 'as any' to temporarily bypass TypeScript limitations
      .insert({
        id: uuidv4(),
        employee_id: userId,
        manager_id: managerId,
        comments: comments || '',
        status: 'pending',
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error requesting review:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting review:', error);
    return false;
  }
};
