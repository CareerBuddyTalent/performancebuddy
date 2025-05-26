
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
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'using default',
  CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'using default',
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
  
  // External services - using working defaults
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'https://eubxxtqbyrlivnenhyjk.supabase.co',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1Ynh4dHFieXJsaXZuZW5oeWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MzMwMzgsImV4cCI6MjA2MDQwOTAzOH0.HtVG14DfSBuZ0dGjsJOHySluwJnCa9eVFx13mQ14ILg',
  CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_live_Y2xlcmsucGVyZm9ybS50aGVjYXJlZXJidWRkeS5jb20k',
  
  // App metadata - for debugging and support
  BUILD_TIME: import.meta.env.VITE_BUILD_TIME || new Date().toISOString(),
  BUILD_COMMIT: import.meta.env.VITE_BUILD_COMMIT || 'dev',
};

// Improved validation functions
export const validateEnvironment = () => {
  const issues: string[] = [];
  
  // Only report issues if both custom and default values are missing
  if (!env.CLERK_PUBLISHABLE_KEY) {
    issues.push('Clerk publishable key is missing and no default available');
  }
  
  if (!env.SUPABASE_URL) {
    issues.push('Supabase URL is missing and no default available');
  }
  
  if (!env.SUPABASE_ANON_KEY) {
    issues.push('Supabase anonymous key is missing and no default available');
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
