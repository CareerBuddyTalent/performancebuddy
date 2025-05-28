
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

// Clerk loading timeout and fallback management
let clerkLoadTimeout: NodeJS.Timeout;
let hasRendered = false;

// Function to render the app with fallback
function renderAppWithFallback() {
  if (hasRendered) return;
  hasRendered = true;
  
  console.warn('Clerk loading timeout or error - falling back to demo mode');
  root.render(<App />);
}

// Function to render the app with Clerk
function renderAppWithClerk() {
  if (hasRendered) return;
  hasRendered = true;
  
  clearTimeout(clerkLoadTimeout);
  console.log('Clerk initialized successfully');
  
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
}

// Enhanced error handling for app rendering
function renderApp() {
  try {
    if (isClerkConfigured()) {
      console.log('Attempting to initialize Clerk...');
      
      // Set a timeout for Clerk initialization
      clerkLoadTimeout = setTimeout(() => {
        if (!hasRendered) {
          console.warn('Clerk loading timeout reached (5s) - falling back to demo mode');
          renderAppWithFallback();
        }
      }, 5000); // 5 second timeout
      
      // Try to render with Clerk
      try {
        renderAppWithClerk();
      } catch (clerkError) {
        console.error('Clerk initialization failed:', clerkError);
        clearTimeout(clerkLoadTimeout);
        renderAppWithFallback();
      }
    } else {
      // Fallback without Clerk when not configured
      console.warn('Clerk not configured, using fallback authentication');
      renderAppWithFallback();
    }
  } catch (error) {
    console.error('Failed to render app:', error);
    
    // Final fallback - render basic error page
    if (!hasRendered) {
      hasRendered = true;
      root.render(
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          fontFamily: 'Arial, sans-serif',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1>Loading...</h1>
          <p>If this takes too long, try refreshing the page.</p>
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
