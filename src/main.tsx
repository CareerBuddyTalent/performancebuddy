
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { performanceOptimizer } from '@/utils/performanceOptimization'
import env, { validateEnvironment } from '@/config/env'
import { SupabaseAuthProvider } from '@/context/SupabaseAuthContext'

// Skip environment validation during build time
if (!env.IS_BUILD_TIME) {
  // Validate environment variables
  const envValidation = validateEnvironment();

  // Only block app loading in development if critical services are completely unavailable
  if (!envValidation.isValid && env.NODE_ENV === 'development') {
    // Check if we have any working configuration (either custom or defaults)
    const hasWorkingConfig = env.SUPABASE_URL && env.SUPABASE_ANON_KEY;
    
    if (!hasWorkingConfig) {
      console.error('Environment validation failed:', envValidation.issues);
      document.body.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto;">
          <h1 style="color: #e74c3c;">Configuration Error</h1>
          <p>The following environment variables are missing:</p>
          <ul style="color: #e74c3c;">
            ${envValidation.issues.map(issue => `<li>${issue}</li>`).join('')}
          </ul>
          <p>Please check your environment configuration and try again.</p>
          <details style="margin-top: 20px;">
            <summary>How to fix this</summary>
            <p>You need to set these environment variables:</p>
            <ul>
              <li><strong>VITE_SUPABASE_URL</strong>: Your Supabase project URL</li>
              <li><strong>VITE_SUPABASE_ANON_KEY</strong>: Your Supabase anonymous key</li>
            </ul>
          </details>
        </div>
      `;
      throw new Error('Missing required environment variables');
    } else {
      // Show warning but continue loading
      console.warn('Some environment variables are using defaults:', envValidation.issues);
    }
  }

  // Initialize performance optimizations (only during runtime)
  performanceOptimizer.initialize();
}

// Create root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

// Render the app wrapped with SupabaseAuthProvider
root.render(
  <SupabaseAuthProvider>
    <App />
  </SupabaseAuthProvider>
);
