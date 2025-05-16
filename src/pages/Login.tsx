
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { LoginForm } from "@/components/auth/login/LoginForm";
import { Spinner } from "@/components/ui/spinner";
import type { LoginFormValues } from "@/components/auth/login/schema";

export default function Login() {
  const { login, authError, clearAuthError, user, session, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginInProgress, setLoginInProgress] = useState(false);
  
  // Get the intended destination from location state or default to dashboard
  const from = (location.state as any)?.from || "/dashboard";

  // Redirect if already logged in
  useEffect(() => {
    // Check both session and user (for development mode)
    const isAuthenticated = session || (process.env.NODE_ENV === 'development' && user);
    
    if (isAuthenticated && !isLoading) {
      console.log("Login - User already authenticated, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [user, session, isLoading, navigate, from]);

  useEffect(() => {
    return () => {
      // Clean up auth errors when component unmounts
      clearAuthError();
    };
  }, [clearAuthError]);

  const handleSubmit = async (data: LoginFormValues) => {
    setLoginInProgress(true);
    
    try {
      const success = await login(data.email, data.password);
      
      if (success) {
        toast.success("Logged in successfully!");
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoginInProgress(false);
    }
  };

  // Don't render the login form if already logged in or still checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Spinner size="lg" />
            <p className="mt-4 text-muted-foreground">Verifying authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check both session and user (for development mode)
  const isAuthenticated = session || (process.env.NODE_ENV === 'development' && user);
  
  // If user is already logged in, don't render form (handled by useEffect redirect)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Spinner size="lg" />
            <p className="mt-4 text-muted-foreground">You are already logged in. Redirecting...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      <div className="w-full max-w-md px-4">
        <Card className="w-full">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <img 
                src="/lovable-uploads/5f7f5cab-6e48-4d4e-b4a2-edee8cc1cbc4.png" 
                alt="CareerBuddy" 
                className="h-8"
              />
            </div>
            <CardDescription>Log in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            {authError && (
              <Alert variant="destructive" className="mb-4">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            <LoginForm
              onSubmit={handleSubmit}
              isLoading={loginInProgress}
              authError={authError}
              clearAuthError={clearAuthError}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
