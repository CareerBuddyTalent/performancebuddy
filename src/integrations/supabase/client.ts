
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

// Create a comprehensive mock client for build time
const createMockClient = () => {
  const mockQueryBuilder = {
    select: () => mockQueryBuilder,
    insert: () => mockQueryBuilder,
    update: () => mockQueryBuilder,
    delete: () => mockQueryBuilder,
    upsert: () => mockQueryBuilder,
    eq: () => mockQueryBuilder,
    neq: () => mockQueryBuilder,
    gt: () => mockQueryBuilder,
    gte: () => mockQueryBuilder,
    lt: () => mockQueryBuilder,
    lte: () => mockQueryBuilder,
    like: () => mockQueryBuilder,
    ilike: () => mockQueryBuilder,
    is: () => mockQueryBuilder,
    in: () => mockQueryBuilder,
    contains: () => mockQueryBuilder,
    containedBy: () => mockQueryBuilder,
    rangeGt: () => mockQueryBuilder,
    rangeGte: () => mockQueryBuilder,
    rangeLt: () => mockQueryBuilder,
    rangeLte: () => mockQueryBuilder,
    rangeAdjacent: () => mockQueryBuilder,
    overlaps: () => mockQueryBuilder,
    textSearch: () => mockQueryBuilder,
    match: () => mockQueryBuilder,
    not: () => mockQueryBuilder,
    or: () => mockQueryBuilder,
    filter: () => mockQueryBuilder,
    order: () => mockQueryBuilder,
    limit: () => mockQueryBuilder,
    range: () => mockQueryBuilder,
    abortSignal: () => mockQueryBuilder,
    single: () => Promise.resolve({ data: null, error: new Error('Build time mock') }),
    maybeSingle: () => Promise.resolve({ data: null, error: new Error('Build time mock') }),
    csv: () => Promise.resolve({ data: '', error: new Error('Build time mock') }),
    geojson: () => Promise.resolve({ data: null, error: new Error('Build time mock') }),
    explain: () => Promise.resolve({ data: null, error: new Error('Build time mock') }),
    rollback: () => Promise.resolve({ data: null, error: new Error('Build time mock') }),
    returns: () => mockQueryBuilder,
    then: () => Promise.resolve({ data: [], error: null }),
    catch: () => Promise.resolve({ data: [], error: null }),
    finally: () => Promise.resolve({ data: [], error: null })
  };

  // Make the query builder thenable (Promise-like)
  Object.defineProperty(mockQueryBuilder, 'then', {
    value: function(resolve?: any, reject?: any) {
      return Promise.resolve({ data: [], error: null }).then(resolve, reject);
    },
    writable: false,
    enumerable: false,
    configurable: true
  });

  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Build time mock') }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Build time mock') }),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ data: {}, error: new Error('Build time mock') }),
    },
    from: () => mockQueryBuilder,
    rpc: () => Promise.resolve({ data: null, error: new Error('Build time mock') }),
    functions: {
      invoke: () => Promise.resolve({ data: null, error: new Error('Build time mock') })
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: new Error('Build time mock') }),
        download: () => Promise.resolve({ data: null, error: new Error('Build time mock') }),
        list: () => Promise.resolve({ data: [], error: new Error('Build time mock') }),
        remove: () => Promise.resolve({ data: null, error: new Error('Build time mock') }),
        createSignedUrl: () => Promise.resolve({ data: null, error: new Error('Build time mock') }),
        createSignedUrls: () => Promise.resolve({ data: [], error: new Error('Build time mock') }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    }
  };
};

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
