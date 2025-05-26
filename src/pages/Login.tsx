
import { SignIn } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import { Navigate, Link } from "react-router-dom";
import { useClerkAuth } from "@/context/ClerkAuthContext";
import { FallbackLoginForm } from "@/components/auth/FallbackLoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
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
          <>
            <SignIn 
              fallbackRedirectUrl="/dashboard"
              signUpUrl="/signup"
              appearance={{
                elements: {
                  formButtonPrimary: "bg-primary hover:bg-primary/90",
                  card: "shadow-lg",
                }
              }}
            />
            <div className="mt-4 text-center">
              <Link 
                to="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          </>
        ) : (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FallbackLoginForm />
              <div className="mt-4 text-center">
                <Link 
                  to="/signup" 
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Don't have an account? Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
