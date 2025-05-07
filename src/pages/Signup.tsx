
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { SignupForm } from "@/components/auth/signup/SignupForm";
import { Spinner } from "@/components/ui/spinner";
import type { SignupFormValues } from "@/components/auth/signup/schema";

export default function Signup() {
  const { signup, authError, clearAuthError, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [signupInProgress, setSignupInProgress] = useState(false);
  
  const from = (location.state as any)?.from || "/dashboard";

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      navigate(from, { replace: true });
    }
  }, [user, isLoading, navigate, from]);

  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  const handleSubmit = async (data: SignupFormValues) => {
    setSignupInProgress(true);
    try {
      const success = await signup(data.email, data.password, data.name, data.role);
      if (success) {
        toast.success("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSignupInProgress(false);
    }
  };

  // Don't render the signup form if already logged in or still checking auth status
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

  // If user is already logged in, don't render form (handled by useEffect redirect)
  if (user) {
    return null;
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
            <CardDescription>Create your account</CardDescription>
          </CardHeader>
          <CardContent>
            {authError && (
              <Alert variant="destructive" className="mb-4">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            <SignupForm
              onSubmit={handleSubmit}
              isLoading={signupInProgress}
              authError={authError}
              clearAuthError={clearAuthError}
            />
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account? {" "}
              <Link to="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
