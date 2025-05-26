
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from "@clerk/clerk-react"
import App from './App.tsx'
import './index.css'
import { performanceOptimizer } from '@/utils/performanceOptimization'
import env, { validateEnvironment } from '@/config/env'

// Validate environment variables
const envValidation = validateEnvironment();

if (!envValidation.isValid) {
  console.error('Environment validation failed:', envValidation.issues);
  
  // Show environment issues in development
  if (env.NODE_ENV === 'development') {
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
            <li><strong>VITE_CLERK_PUBLISHABLE_KEY</strong>: Get this from your Clerk dashboard</li>
            <li><strong>VITE_SUPABASE_URL</strong>: Your Supabase project URL</li>
            <li><strong>VITE_SUPABASE_ANON_KEY</strong>: Your Supabase anonymous key</li>
          </ul>
        </details>
      </div>
    `;
    throw new Error('Missing required environment variables');
  }
}

const PUBLISHABLE_KEY = env.CLERK_PUBLISHABLE_KEY;

// Initialize performance optimizations
performanceOptimizer.initialize();

// Create root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

// Render app with error handling
try {
  if (PUBLISHABLE_KEY) {
    root.render(
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY}
        appearance={{
          variables: {
            colorPrimary: '#3b82f6'
          }
        }}
      >
        <App />
      </ClerkProvider>
    );
  } else {
    // Fallback when Clerk key is missing
    root.render(<App />);
  }
} catch (error) {
  console.error('Failed to render app:', error);
  root.render(
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1>Application Error</h1>
      <p>Unable to load the application. Please refresh the page or contact support.</p>
    </div>
  );
}
