
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
  // Mock response for build time
  const mockResponse = { data: [], error: null };
  const mockErrorResponse = { data: null, error: new Error('Build time mock') };

  // Create a proper mock query builder that returns Promises
  const createMockQueryBuilder = () => {
    const builder = {
      select: (columns?: string) => createMockQueryBuilder(),
      insert: (values: any) => createMockQueryBuilder(),
      update: (values: any) => createMockQueryBuilder(),
      delete: () => createMockQueryBuilder(),
      upsert: (values: any) => createMockQueryBuilder(),
      eq: (column: string, value: any) => createMockQueryBuilder(),
      neq: (column: string, value: any) => createMockQueryBuilder(),
      gt: (column: string, value: any) => createMockQueryBuilder(),
      gte: (column: string, value: any) => createMockQueryBuilder(),
      lt: (column: string, value: any) => createMockQueryBuilder(),
      lte: (column: string, value: any) => createMockQueryBuilder(),
      like: (column: string, pattern: string) => createMockQueryBuilder(),
      ilike: (column: string, pattern: string) => createMockQueryBuilder(),
      is: (column: string, value: any) => createMockQueryBuilder(),
      in: (column: string, values: any[]) => createMockQueryBuilder(),
      contains: (column: string, value: any) => createMockQueryBuilder(),
      containedBy: (column: string, value: any) => createMockQueryBuilder(),
      rangeGt: (column: string, value: any) => createMockQueryBuilder(),
      rangeGte: (column: string, value: any) => createMockQueryBuilder(),
      rangeLt: (column: string, value: any) => createMockQueryBuilder(),
      rangeLte: (column: string, value: any) => createMockQueryBuilder(),
      rangeAdjacent: (column: string, value: any) => createMockQueryBuilder(),
      overlaps: (column: string, value: any) => createMockQueryBuilder(),
      textSearch: (column: string, query: string) => createMockQueryBuilder(),
      match: (query: Record<string, any>) => createMockQueryBuilder(),
      not: (column: string, operator: string, value: any) => createMockQueryBuilder(),
      or: (filters: string) => createMockQueryBuilder(),
      filter: (column: string, operator: string, value: any) => createMockQueryBuilder(),
      order: (column: string, options?: { ascending?: boolean }) => createMockQueryBuilder(),
      limit: (count: number) => createMockQueryBuilder(),
      range: (from: number, to: number) => createMockQueryBuilder(),
      abortSignal: (signal: AbortSignal) => createMockQueryBuilder(),
      single: () => Promise.resolve(mockErrorResponse),
      maybeSingle: () => Promise.resolve(mockErrorResponse),
      csv: () => Promise.resolve({ data: '', error: new Error('Build time mock') }),
      geojson: () => Promise.resolve(mockErrorResponse),
      explain: () => Promise.resolve(mockErrorResponse),
      rollback: () => Promise.resolve(mockErrorResponse),
      returns: () => createMockQueryBuilder(),
    };

    // Make the builder awaitable by adding Symbol.asyncIterator
    (builder as any)[Symbol.asyncIterator] = async function* () {
      yield mockResponse;
    };

    // Override valueOf to return a Promise when used in await context
    (builder as any).valueOf = () => Promise.resolve(mockResponse);
    
    // Make it thenable for direct Promise usage
    (builder as any).then = (resolve?: any, reject?: any) => {
      return Promise.resolve(mockResponse).then(resolve, reject);
    };

    return builder;
  };

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
    from: (table: string) => createMockQueryBuilder(),
    rpc: (fn: string, args?: any) => Promise.resolve(mockErrorResponse),
    functions: {
      invoke: (functionName: string, options?: any) => Promise.resolve(mockErrorResponse)
    },
    storage: {
      from: (bucket: string) => ({
        upload: () => Promise.resolve(mockErrorResponse),
        download: () => Promise.resolve(mockErrorResponse),
        list: () => Promise.resolve({ data: [], error: new Error('Build time mock') }),
        remove: () => Promise.resolve(mockErrorResponse),
        createSignedUrl: () => Promise.resolve(mockErrorResponse),
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
