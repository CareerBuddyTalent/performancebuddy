
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from "@clerk/clerk-react"
import App from './App.tsx'
import './index.css'
import { performanceOptimizer } from '@/utils/performanceOptimization'
import env, { validateEnvironment, isClerkConfigured } from '@/config/env'

// Validate environment variables
const envValidation = validateEnvironment();

// Show setup instructions if Clerk is not configured
if (!isClerkConfigured()) {
  console.warn('⚠️ Clerk Authentication Setup Required');
  console.log('📋 To enable full authentication features:');
  console.log('1. Visit https://go.clerk.com/lovable to create a Clerk account');
  console.log('2. Get your publishable key from the Clerk dashboard');
  console.log('3. Set VITE_CLERK_PUBLISHABLE_KEY in your environment');
  console.log('4. The app will continue in demo mode until configured');
}

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
            <li><strong>VITE_CLERK_PUBLISHABLE_KEY</strong>: Get this from your Clerk dashboard at https://go.clerk.com/lovable</li>
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

const PUBLISHABLE_KEY = env.CLERK_PUBLISHABLE_KEY;

// Initialize performance optimizations
performanceOptimizer.initialize();

// Create root element
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

// Enhanced error handling for app rendering
function renderApp() {
  try {
    if (isClerkConfigured()) {
      // Render with Clerk when properly configured
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
      // Fallback without Clerk when not configured
      console.warn('Clerk not configured, using fallback authentication');
      root.render(<App />);
    }
  } catch (error) {
    console.error('Failed to render app with primary configuration:', error);
    
    // Final fallback - render without any external providers
    try {
      root.render(<App />);
    } catch (fallbackError) {
      console.error('Failed to render app with fallback:', fallbackError);
      root.render(
        <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
          <h1>Application Error</h1>
          <p>Unable to load the application. Please refresh the page or contact support.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
  }
}

// Render the app
renderApp();
