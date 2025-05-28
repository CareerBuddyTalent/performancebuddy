
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { useClerkAuth } from "@/context/ClerkAuthContext";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import CTA from "@/components/landing/CTA";
import LandingFooter from "@/components/landing/LandingFooter";
import { GlobalLoading } from "@/components/ui/global-loading";
import { useEffect, useState } from "react";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const { isAuthenticated, isLoading, isClerkAvailable } = useClerkAuth();
  const [showSlowLoadingMessage, setShowSlowLoadingMessage] = useState(false);

  // Show message if loading takes too long
  useEffect(() => {
    if (isLoading || (!isLoaded && isClerkAvailable)) {
      const timer = setTimeout(() => {
        setShowSlowLoadingMessage(true);
      }, 3000); // Show message after 3 seconds

      return () => clearTimeout(timer);
    } else {
      setShowSlowLoadingMessage(false);
    }
  }, [isLoading, isLoaded, isClerkAvailable]);

  // Show loading with timeout message
  if ((!isLoaded || isLoading) && isClerkAvailable) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <GlobalLoading message="Loading authentication..." />
          {showSlowLoadingMessage && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md">
              <p className="text-yellow-800 text-sm">
                Taking longer than usual? This might be due to network connectivity.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
              >
                Refresh Page
              </button>
            </div>
          )}
        </div>
      </div>
    );
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
