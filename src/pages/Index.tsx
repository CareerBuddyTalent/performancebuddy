
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { useClerkAuth } from "@/context/ClerkAuthContext";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import CTA from "@/components/landing/CTA";
import LandingFooter from "@/components/landing/LandingFooter";
import { GlobalLoading } from "@/components/ui/global-loading";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const { isAuthenticated, isLoading, isClerkAvailable } = useClerkAuth();

  // Show loading while checking auth status, but with timeout
  if ((!isLoaded || isLoading) && isClerkAvailable) {
    return <GlobalLoading message="Loading..." />;
  }

  // Redirect authenticated users to dashboard
  if (isSignedIn || isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <CTA />
      <LandingFooter />
      
      {/* Show demo mode indicator when Clerk is not available */}
      {!isClerkAvailable && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-sm">
          <p className="text-yellow-800">
            🚧 Demo Mode: Authentication service unavailable
          </p>
        </div>
      )}
    </div>
  );
}
