
import { User, UserRole } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import { users } from '@/data/mockData';
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
    
    // For demo/development mode - use mock data to simplify testing
    if (process.env.NODE_ENV === 'development') {
      // Find user with matching email in our mock data
      const demoUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (demoUser && password === 'password123') {
        console.log('Demo login successful for:', demoUser);
        return { success: true, user: demoUser };
      } else if (demoUser) {
        console.log('Demo login failed: Invalid password');
        return { 
          success: false, 
          error: 'Invalid password. For demo accounts, use "password123".' 
        };
      } else {
        console.log('Demo login failed: User not found');
        return {
          success: false,
          error: 'User not found. Try one of the demo accounts shown below.'
        };
      }
    }
    
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
    const userRole = data.user.user_metadata.role || 'employee';
    const userName = data.user.user_metadata.full_name || data.user.email?.split('@')[0] || 'User';
    
    const appUser: User = {
      id: data.user.id,
      name: userName,
      email: data.user.email || '',
      role: userRole as UserRole,
      profilePicture: data.user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`
    };
    
    return { success: true, user: appUser };
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
      return { success: true, user: newUser };
    }
    
    return { success: true };
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
    if (process.env.NODE_ENV === 'production') {
      // Fix: Use a more generic method to insert data when the table may not be in the type system
      const { error } = await supabase
        .from('review_requests' as any) // Using 'as any' to temporarily bypass TypeScript limitations
        .insert({
          id: uuidv4(),
          employee_id: userId,
          manager_id: managerId,
          comments: comments || '',
          status: 'pending',
          created_at: new Date().toISOString() // Fix: Convert Date to string
        });

      if (error) {
        console.error('Error requesting review:', error);
        return false;
      }
    } else {
      // Simulate API delay in development
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For development, we'll just log this
      console.log('Review requested with:', {
        employee_id: userId,
        manager_id: managerId,
        comments: comments || '',
        status: 'pending'
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting review:', error);
    return false;
  }
};
