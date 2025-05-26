
/**
 * Environment configuration
 * 
 * This file centralizes all environment-specific configuration.
 * Values are loaded from import.meta.env with appropriate fallbacks.
 */

// Define typed environment variables
interface EnvConfig {
  // App information
  APP_NAME: string;
  APP_VERSION: string;
  
  // Environment
  NODE_ENV: 'development' | 'production' | 'test';
  BASE_URL: string;
  
  // Feature flags
  ENABLE_ANALYTICS: boolean;
  
  // External services
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  CLERK_PUBLISHABLE_KEY: string;
  
  // App metadata
  BUILD_TIME: string;
  BUILD_COMMIT: string;
}

// Debugging to help identify environment variable issues
console.log('Environment variables debug:', {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'not set',
  CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'not set',
  MODE: import.meta.env.MODE || 'not set',
  DEV: import.meta.env.DEV ? 'true' : 'false',
  PROD: import.meta.env.PROD ? 'true' : 'false',
});

// Get environment variables with fallbacks
const env: EnvConfig = {
  // App information
  APP_NAME: import.meta.env.VITE_APP_NAME || 'CareerBuddy',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Environment
  NODE_ENV: (import.meta.env.MODE || 'development') as EnvConfig['NODE_ENV'],
  BASE_URL: import.meta.env.BASE_URL || '/',
  
  // Feature flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  
  // External services
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '',
  
  // App metadata - for debugging and support
  BUILD_TIME: import.meta.env.VITE_BUILD_TIME || new Date().toISOString(),
  BUILD_COMMIT: import.meta.env.VITE_BUILD_COMMIT || 'dev',
};

// Validation functions
export const validateEnvironment = () => {
  const issues: string[] = [];
  
  if (!env.CLERK_PUBLISHABLE_KEY) {
    issues.push('Clerk publishable key is missing (VITE_CLERK_PUBLISHABLE_KEY)');
  }
  
  if (!env.SUPABASE_URL) {
    issues.push('Supabase URL is missing (VITE_SUPABASE_URL)');
  }
  
  if (!env.SUPABASE_ANON_KEY) {
    issues.push('Supabase anonymous key is missing (VITE_SUPABASE_ANON_KEY)');
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
};

// Convenience function to check if we're in production
export const isProd = env.NODE_ENV === 'production';
export const isDev = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';

export default env;
