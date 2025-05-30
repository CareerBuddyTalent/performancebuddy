
// Environment configuration with security improvements
// Use actual Supabase credentials from the integration

const env = {
  // Supabase configuration - using actual credentials from Supabase integration
  SUPABASE_URL: 'https://eubxxtqbyrlivnenhyjk.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1Ynh4dHFieXJsaXZuZW5oeWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MzMwMzgsImV4cCI6MjA2MDQwOTAzOH0.HtVG14DfSBuZ0dGjsJOHySluwJnCa9eVFx13mQ14ILg',
  
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
};

// Validate required environment variables
export const validateEnvironment = () => {
  const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
  const missing = required.filter(key => !env[key as keyof typeof env]);
  
  const issues = missing.map(key => `Missing ${key}`);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    // In development, show a helpful error
    if (env.NODE_ENV === 'development') {
      console.error('Please check your .env file and ensure these variables are set.');
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

// Validate on import
const isValid = validateEnv();

export { isValid as envIsValid };
export default env;
