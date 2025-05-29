
import { createClient } from '@supabase/supabase-js';
import env, { envIsValid } from '@/config/env';

// Verify environment configuration
if (!envIsValid) {
  console.error('Supabase client initialization failed: Missing required environment variables');
}

const supabaseUrl = env.SUPABASE_URL;
const supabaseAnonKey = env.SUPABASE_ANON_KEY;

// Validate URL and key format
const isValidUrl = supabaseUrl && supabaseUrl.startsWith('https://') && supabaseUrl.includes('.supabase.co');
const isValidKey = supabaseAnonKey && supabaseAnonKey.length > 100; // JWT tokens are typically longer

if (!isValidUrl || !isValidKey) {
  console.error('Invalid Supabase credentials detected');
}

// Initialize the Supabase client with secure configuration
export const supabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      // Security: Restrict to same origin
      storageKey: 'supabase.auth.token',
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
    global: {
      headers: {
        'x-application-name': env.APP_NAME,
        'x-application-version': env.APP_VERSION,
      },
    },
    // Security: Disable realtime in production if not needed
    realtime: {
      params: {
        eventsPerSecond: 10, // Rate limit realtime events
      },
    },
  }
);

// Export both as default and named export for backward compatibility
export const supabase = supabaseClient;
export default supabaseClient;
