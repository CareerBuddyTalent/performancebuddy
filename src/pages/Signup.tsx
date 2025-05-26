
import { SignUp } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export default function Signup() {
  const { isSignedIn } = useAuth();

  // Redirect to dashboard if already signed in
  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
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
    </div>
  );
}
