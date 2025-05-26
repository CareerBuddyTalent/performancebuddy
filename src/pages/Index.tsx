
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import CTA from "@/components/landing/CTA";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  // Show loading while checking auth status
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Redirect authenticated users to dashboard
  if (isSignedIn) {
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
