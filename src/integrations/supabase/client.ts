
import { createClient } from '@supabase/supabase-js';
import env from '@/config/env';

// Initialize the Supabase client with environment variables
export const supabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'x-application-name': env.APP_NAME,
        'x-application-version': env.APP_VERSION,
      },
    },
  }
);

// Export for convenience
export default supabaseClient;
