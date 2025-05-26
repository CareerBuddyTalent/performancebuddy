
import { SignUp } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import { Navigate, Link } from "react-router-dom";
import { useClerkAuth } from "@/context/ClerkAuthContext";
import { FallbackSignupForm } from "@/components/auth/FallbackSignupForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Signup() {
  const { isSignedIn } = useAuth();
  const { isClerkAvailable, isAuthenticated } = useClerkAuth();

  // Redirect to dashboard if already signed in
  if (isSignedIn || isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md">
        {isClerkAvailable ? (
          <SignUp 
            fallbackRedirectUrl="/dashboard"
            signInUrl="/login"
            appearance={{
              elements: {
                formButtonPrimary: "bg-primary hover:bg-primary/90",
                card: "shadow-lg",
              }
            }}
          />
        ) : (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>
                Sign up to get started with your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FallbackSignupForm />
              <div className="mt-4 text-center">
                <Link 
                  to="/login" 
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Already have an account? Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
