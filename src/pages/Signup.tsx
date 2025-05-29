
import { Navigate, Link } from "react-router-dom";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { SecureSignupForm } from "@/components/auth/SecureSignupForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Signup() {
  const { isAuthenticated } = useSupabaseAuth();

  // Redirect to dashboard if already signed in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Sign up to get started with your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SecureSignupForm />
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
      </div>
    </div>
  );
}
