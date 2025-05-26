
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from "@clerk/clerk-react"
import App from './App.tsx'
import './index.css'
import { performanceOptimizer } from '@/utils/performanceOptimization'

const PUBLISHABLE_KEY = "pk_test_YWNlLXNoZWVwZG9nLTkxLmNsZXJrLmFjY291bnRzLmRldiQ"

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key")
}

// Initialize performance optimizations
performanceOptimizer.initialize();

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
