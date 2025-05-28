
import { Navigate } from "react-router-dom";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import CTA from "@/components/landing/CTA";
import LandingFooter from "@/components/landing/LandingFooter";
import { GlobalLoading } from "@/components/ui/global-loading";

export default function Index() {
  const { isAuthenticated, isLoading } = useSupabaseAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <GlobalLoading message="Loading..." />
      </div>
    );
  }

  // Redirect authenticated users to dashboard
  if (isAuthenticated) {
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
    </div>
  );
}
