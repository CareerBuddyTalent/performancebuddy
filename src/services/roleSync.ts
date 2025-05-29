
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types';

export class RoleSyncService {
  /**
   * Update user profile information
   * This replaces the old syncUserProfile method with Supabase-native operations
   */
  static async updateUserProfile(
    name?: string,
    department?: string,
    position?: string,
    manager?: string
  ): Promise<void> {
    try {
      console.log('Updating user profile with:', { name, department, position, manager });
      
      // Use the new Supabase function to update profile
      const { error } = await supabase.rpc('update_user_profile', {
        profile_name: name || null,
        profile_department: department || null,
        profile_position: position || null,
        profile_manager: manager || null
      });

      if (error) {
        console.error('Error updating user profile:', error);
        throw error;
      }

      console.log('User profile updated successfully');
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  }

  /**
   * Update user role (admin only)
   */
  static async updateUserRole(userId: string, role: UserRole): Promise<void> {
    try {
      console.log('Updating user role:', { userId, role });
      
      const { error } = await supabase.rpc('update_user_role', {
        target_user_id: userId,
        new_role: role
      });

      if (error) {
        console.error('Error updating user role:', error);
        throw error;
      }

      console.log('User role updated successfully');
    } catch (error) {
      console.error('Failed to update user role:', error);
      throw error;
    }
  }

  /**
   * Get user profile with role information
   */
  static async getUserProfileWithRole(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.rpc('get_user_profile_with_role', {
        user_id_param: userId
      });

      if (error) {
        console.error('Error getting user profile with role:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        return null;
      }

      const profile = data[0];
      return {
        id: profile.id,
        email: profile.email,
        name: profile.name || 'Unknown User',
        role: profile.role,
        department: profile.department,
        position: profile.position,
        manager: profile.manager,
        joinDate: profile.created_at ? new Date(profile.created_at) : undefined
      };
    } catch (error) {
      console.error('Failed to get user profile with role:', error);
      return null;
    }
  }

  /**
   * Validate user role - keeps existing implementation as it already works with Supabase
   */
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

  /**
   * Ensure user profile exists - keeps existing implementation as it already works with Supabase
   */
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

  /**
   * Promote user to manager role (admin only)
   */
  static async promoteToManager(userId: string): Promise<void> {
    return this.updateUserRole(userId, 'manager');
  }

  /**
   * Promote user to admin role (admin only)
   */
  static async promoteToAdmin(userId: string): Promise<void> {
    return this.updateUserRole(userId, 'admin');
  }

  /**
   * Demote user to employee role (admin only)
   */
  static async demoteToEmployee(userId: string): Promise<void> {
    return this.updateUserRole(userId, 'employee');
  }

  /**
   * Check if current user is admin
   */
  static async isCurrentUserAdmin(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const role = await this.validateUserRole(user.id);
      return role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  /**
   * Bulk update user roles (admin only)
   */
  static async bulkUpdateUserRoles(updates: Array<{ userId: string; role: UserRole }>): Promise<void> {
    try {
      console.log('Bulk updating user roles:', updates);
      
      const promises = updates.map(update => 
        this.updateUserRole(update.userId, update.role)
      );
      
      await Promise.all(promises);
      console.log('Bulk user role update completed successfully');
    } catch (error) {
      console.error('Failed to bulk update user roles:', error);
      throw error;
    }
  }
}
