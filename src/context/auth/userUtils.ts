
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

export const convertSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User> => {
  try {
    console.log('Converting Supabase user:', supabaseUser.id);
    
    // Get user profile from profiles table with better error handling
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .maybeSingle();

    if (profileError) {
      console.warn('Profile fetch error (will create profile):', profileError);
    }

    // Create profile if it doesn't exist
    if (!profile) {
      console.log('Creating missing profile for user:', supabaseUser.id);
      const newProfile = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User'
      };

      const { data: createdProfile, error: insertError } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();

      if (insertError) {
        console.error('Profile creation failed:', insertError);
        // Continue with fallback data instead of failing completely
      } else {
        console.log('Profile created successfully:', createdProfile);
      }
    }

    // Get user role from user_roles table
    const { data: userRole, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', supabaseUser.id)
      .maybeSingle();

    if (roleError) {
      console.warn('Role fetch error (will create default role):', roleError);
    }

    // Create default role if it doesn't exist
    if (!userRole) {
      console.log('Creating default role for user:', supabaseUser.id);
      const { error: roleInsertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: supabaseUser.id,
          role: 'employee'
        });

      if (roleInsertError) {
        console.error('Role creation failed:', roleInsertError);
        // Continue with default role instead of failing
      } else {
        console.log('Default role created successfully');
      }
    }

    // Always return a valid user object
    const convertedUser: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: (profile?.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User'),
      role: (userRole?.role as 'admin' | 'manager' | 'employee') || 'employee',
      profilePicture: profile?.avatar_url || profile?.profile_picture
    };

    console.log('Successfully converted user:', convertedUser.id, 'with role:', convertedUser.role);
    return convertedUser;
    
  } catch (error) {
    console.error('Error in convertSupabaseUser (using fallback):', error);
    
    // Return basic user info as fallback
    const fallbackUser: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
      role: 'employee' as const,
      profilePicture: undefined
    };
    
    console.log('Using fallback user data:', fallbackUser);
    return fallbackUser;
  }
};
