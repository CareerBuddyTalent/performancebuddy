
import { clerkClient } from '@clerk/clerk-sdk-node';
import { supabase } from '@/integrations/supabase/client';

interface SupabaseUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar_url?: string;
  created_at: string;
}

interface MigrationResult {
  success: boolean;
  email: string;
  clerkUserId?: string;
  error?: string;
}

export class UserMigration {
  private clerkSecretKey: string;

  constructor(clerkSecretKey: string) {
    this.clerkSecretKey = clerkSecretKey;
  }

  async getSupabaseUsers(): Promise<SupabaseUser[]> {
    console.log('Fetching users from Supabase...');
    
    // Get profiles and their roles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        name,
        avatar_url,
        created_at
      `);

    if (profilesError) {
      throw new Error(`Failed to fetch profiles: ${profilesError.message}`);
    }

    // Get user roles
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');

    if (rolesError) {
      throw new Error(`Failed to fetch user roles: ${rolesError.message}`);
    }

    // Combine profiles with roles
    const users: SupabaseUser[] = profiles?.map(profile => {
      const userRole = userRoles?.find(role => role.user_id === profile.id);
      return {
        id: profile.id,
        email: profile.email,
        name: profile.name || profile.email.split('@')[0],
        role: userRole?.role || 'employee',
        avatar_url: profile.avatar_url,
        created_at: profile.created_at
      };
    }) || [];

    console.log(`Found ${users.length} users in Supabase`);
    return users;
  }

  async createClerkUser(user: SupabaseUser): Promise<MigrationResult> {
    try {
      console.log(`Creating Clerk user for: ${user.email}`);

      // Check if user already exists in Clerk
      const existingUsers = await clerkClient.users.getUserList({
        emailAddress: [user.email]
      });

      if (existingUsers.length > 0) {
        console.log(`User ${user.email} already exists in Clerk`);
        return {
          success: true,
          email: user.email,
          clerkUserId: existingUsers[0].id,
          error: 'User already exists'
        };
      }

      // Create new user in Clerk
      const clerkUser = await clerkClient.users.createUser({
        emailAddress: [user.email],
        firstName: user.name.split(' ')[0] || user.name,
        lastName: user.name.split(' ').slice(1).join(' ') || undefined,
        publicMetadata: {
          role: user.role,
          migratedFromSupabase: true,
          originalSupabaseId: user.id
        },
        privateMetadata: {
          supabaseId: user.id,
          migrationDate: new Date().toISOString()
        },
        skipPasswordChecks: true,
        skipPasswordRequirement: true
      });

      console.log(`Successfully created Clerk user: ${user.email} (ID: ${clerkUser.id})`);

      return {
        success: true,
        email: user.email,
        clerkUserId: clerkUser.id
      };

    } catch (error: any) {
      console.error(`Failed to create Clerk user for ${user.email}:`, error);
      return {
        success: false,
        email: user.email,
        error: error.message || 'Unknown error'
      };
    }
  }

  async migrateAllUsers(): Promise<MigrationResult[]> {
    try {
      const supabaseUsers = await this.getSupabaseUsers();
      const results: MigrationResult[] = [];

      console.log(`Starting migration of ${supabaseUsers.length} users...`);

      for (const user of supabaseUsers) {
        const result = await this.createClerkUser(user);
        results.push(result);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const successful = results.filter(r => r.success && !r.error?.includes('already exists'));
      const existing = results.filter(r => r.error?.includes('already exists'));
      const failed = results.filter(r => !r.success);

      console.log('\n=== Migration Summary ===');
      console.log(`Total users processed: ${results.length}`);
      console.log(`Successfully migrated: ${successful.length}`);
      console.log(`Already existed: ${existing.length}`);
      console.log(`Failed: ${failed.length}`);

      if (failed.length > 0) {
        console.log('\nFailed migrations:');
        failed.forEach(f => console.log(`- ${f.email}: ${f.error}`));
      }

      return results;

    } catch (error: any) {
      console.error('Migration failed:', error);
      throw error;
    }
  }
}

// Usage function
export async function runMigration(clerkSecretKey: string) {
  if (!clerkSecretKey) {
    throw new Error('Clerk secret key is required');
  }

  const migration = new UserMigration(clerkSecretKey);
  return await migration.migrateAllUsers();
}
