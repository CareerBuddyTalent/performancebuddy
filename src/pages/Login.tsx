
import { Navigate, Link } from "react-router-dom";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { SecureLoginForm } from "@/components/auth/SecureLoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
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
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SecureLoginForm />
            <div className="mt-4 text-center space-y-2">
              <Link 
                to="/signup" 
                className="text-sm text-blue-600 hover:text-blue-500 block"
              >
                Don't have an account? Sign up
              </Link>
              <Link 
                to="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-500 block"
              >
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
