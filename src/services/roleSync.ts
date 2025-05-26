
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

export class RoleSyncService {
  static async syncUserProfile(user: User): Promise<void> {
    try {
      console.log('Syncing user profile:', user.id);
      
      // Call the sync function we created in the migration
      const { error } = await supabase.rpc('sync_clerk_user_profile', {
        user_id_param: user.id,
        email_param: user.email,
        name_param: user.name,
        role_param: user.role,
        profile_picture_param: user.profilePicture || null
      });

      if (error) {
        console.error('Error syncing user profile:', error);
        throw error;
      }

      console.log('User profile synced successfully');
    } catch (error) {
      console.error('Failed to sync user profile:', error);
      throw error;
    }
  }

  static async validateUserRole(userId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error validating user role:', error);
        return null;
      }

      return data?.role || 'employee';
    } catch (error) {
      console.error('Failed to validate user role:', error);
      return null;
    }
  }

  static async ensureUserProfile(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, this is expected for new users
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking user profile:', error);
      return false;
    }
  }
}
