
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
}

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
  
  // External services - using the existing Supabase config
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};

// Convenience function to check if we're in production
export const isProd = env.NODE_ENV === 'production';
export const isDev = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';

export default env;
