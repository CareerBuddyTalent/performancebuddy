
// Environment configuration with proper Vite environment variables support
// Use environment variables for production deployment

const env = {
  // Supabase configuration - use environment variables in production
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'https://eubxxtqbyrlivnenhyjk.supabase.co',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1Ynh4dHFieXJsaXZuZW5oeWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MzMwMzgsImV4cCI6MjA2MDQwOTAzOH0.HtVG14DfSBuZ0dGjsJOHySluwJnCa9eVFx13mQ14ILg',
  
  // App configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'CareerBuddy',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Environment
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  
  // Feature flags
  ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  ENABLE_DEBUG_LOGS: import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true' && import.meta.env.NODE_ENV === 'development',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  
  // Security settings
  SESSION_TIMEOUT_MINUTES: parseInt(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES || '60'),
  MAX_LOGIN_ATTEMPTS: parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS || '5'),

  // Build-time detection
  IS_BUILD_TIME: typeof window === 'undefined',
};

// Validate required environment variables (only during runtime, not build time)
export const validateEnvironment = () => {
  // Skip validation during build time
  if (env.IS_BUILD_TIME) {
    return {
      isValid: true,
      issues: []
    };
  }

  const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  const missing = required.filter(key => !env[key as keyof typeof env]);
  
  const issues = missing.map(key => `Missing ${key}`);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    // In development, show a helpful error
    if (env.NODE_ENV === 'development') {
      console.error('Please check your environment variables and ensure these are set.');
    }
  }
  
  return {
    isValid: missing.length === 0,
    issues
  };
};

// Legacy validation function
const validateEnv = () => {
  const validation = validateEnvironment();
  return validation.isValid;
};

// Only validate during runtime, not build time
const isValid = env.IS_BUILD_TIME ? true : validateEnv();

export { isValid as envIsValid };
export default env;
