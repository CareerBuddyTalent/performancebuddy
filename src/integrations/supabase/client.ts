
import { createClient } from '@supabase/supabase-js';
import env from '@/config/env';

// Verify URL and key values
const supabaseUrl = env.SUPABASE_URL || '';
const supabaseAnonKey = env.SUPABASE_ANON_KEY || '';

// Log warning if values are missing (this helps during development)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials:', {
    url: supabaseUrl ? 'set' : 'missing',
    key: supabaseAnonKey ? 'set' : 'missing',
  });
}

// Initialize the Supabase client with environment variables and defaults
export const supabaseClient = createClient(
  // Use default test values for development if environment variables are not set
  supabaseUrl || 'https://eubxxtqbyrlivnenhyjk.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1Ynh4dHFieXJsaXZuZW5oeWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MzMwMzgsImV4cCI6MjA2MDQwOTAzOH0.HtVG14DfSBuZ0dGjsJOHySluwJnCa9eVFx13mQ14ILg',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'x-application-name': env.APP_NAME || 'CareerBuddy',
        'x-application-version': env.APP_VERSION || '1.0.0',
      },
    },
  }
);

// Export both as default and named export for backward compatibility
export const supabase = supabaseClient;
export default supabaseClient;
