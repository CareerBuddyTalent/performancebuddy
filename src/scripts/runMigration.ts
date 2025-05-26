
import { runMigration } from './migrateUsersToClerk';

// Migration runner script
async function main() {
  const clerkSecretKey = process.env.CLERK_SECRET_KEY;

  if (!clerkSecretKey) {
    console.error('Error: CLERK_SECRET_KEY environment variable is required');
    console.log('Please set your Clerk secret key:');
    console.log('export CLERK_SECRET_KEY="sk_test_..."');
    process.exit(1);
  }

  try {
    console.log('🚀 Starting user migration from Supabase to Clerk...\n');
    
    const results = await runMigration(clerkSecretKey);
    
    console.log('\n✅ Migration completed successfully!');
    console.log(`Check your Clerk dashboard to verify the migrated users.`);
    
  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}
