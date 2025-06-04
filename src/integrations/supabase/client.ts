
import { createClient } from '@supabase/supabase-js';
import env, { envIsValid } from '@/config/env';

// Skip Supabase client initialization during build time
if (env.IS_BUILD_TIME) {
  console.log('Build time detected, skipping Supabase client initialization');
}

// Verify environment configuration (only during runtime)
if (!env.IS_BUILD_TIME && !envIsValid) {
  console.error('Supabase client initialization failed: Missing required environment variables');
}

const supabaseUrl = env.SUPABASE_URL;
const supabaseAnonKey = env.SUPABASE_ANON_KEY;

// Validate URL and key format (only during runtime)
let isValidUrl = true;
let isValidKey = true;

if (!env.IS_BUILD_TIME) {
  isValidUrl = supabaseUrl && supabaseUrl.startsWith('https://') && supabaseUrl.includes('.supabase.co');
  isValidKey = supabaseAnonKey && supabaseAnonKey.length > 100; // JWT tokens are typically longer

  if (!isValidUrl || !isValidKey) {
    console.error('Invalid Supabase credentials detected');
  }
}

// Create a mock client for build time
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Build time mock') }),
    signUp: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Build time mock') }),
    signOut: () => Promise.resolve({ error: null }),
    resetPasswordForEmail: () => Promise.resolve({ data: {}, error: new Error('Build time mock') }),
  },
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: [], error: null }),
    update: () => Promise.resolve({ data: [], error: null }),
    delete: () => Promise.resolve({ data: [], error: null }),
    upsert: () => Promise.resolve({ data: [], error: null }),
  }),
  rpc: () => Promise.resolve({ data: null, error: new Error('Build time mock') }),
});

// Initialize the Supabase client with secure configuration or mock for build time
export const supabaseClient = env.IS_BUILD_TIME 
  ? createMockClient()
  : createClient(
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
