
import { SignIn } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import { Navigate, Link } from "react-router-dom";

export default function Login() {
  const { isSignedIn } = useAuth();

  // Redirect to dashboard if already signed in
  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md">
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
      </div>
    </div>
  );
}
