
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { LoginForm } from "@/components/auth/login/LoginForm";
import { GlobalLoading } from "@/components/ui/global-loading";
import { ErrorState } from "@/components/ui/error-state";
import { useAnalytics } from "@/context/AnalyticsContext";
import analytics from "@/services/analytics";
import type { LoginFormValues } from "@/components/auth/login/schema";

export default function Login() {
  const { login, authError, clearAuthError, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginInProgress, setLoginInProgress] = useState(false);
  const { trackEvent } = useAnalytics();
  const [systemError, setSystemError] = useState<string | null>(null);
  
  // Get the intended destination from location state or default to dashboard
  const from = (location.state as any)?.from || "/dashboard";

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log("Login - User already authenticated, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  useEffect(() => {
    // Clean up auth errors when component unmounts
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  const handleSubmit = async (data: LoginFormValues) => {
    setLoginInProgress(true);
    setSystemError(null);
    
    try {
      const success = await login(data.email, data.password);
      
      if (success) {
        toast.success("Logged in successfully!");
        analytics.track('login', { email: data.email });
        navigate(from, { replace: true });
      } else {
        // If login returns false but no authError is set, show a generic message
        if (!authError) {
          setSystemError("Failed to log in. Please check your credentials.");
        }
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Unknown login error";
      setSystemError(errorMessage);
      analytics.error(`Login error: ${errorMessage}`);
    } finally {
      setLoginInProgress(false);
    }
  };

  const retryAfterError = () => {
    setSystemError(null);
  };

  // Handle system-level errors
  if (systemError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/40">
        <ErrorState 
          title="Login Error" 
          message={systemError} 
          retry={retryAfterError} 
        />
      </div>
    );
  }

  // Don't render the login form if already logged in or still checking auth status
  if (isLoading) {
    return <GlobalLoading message="Verifying authentication..." fullScreen />;
  }

  // If user is already logged in, don't render form (handled by useEffect redirect)
  if (isAuthenticated) {
    return <GlobalLoading message="You are already logged in. Redirecting..." fullScreen />;
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
            <CardDescription className="text-lg font-medium">Log in to your account</CardDescription>
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
