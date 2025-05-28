
import { Navigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { toast } from "sonner";

export default function ForgotPassword() {
  const { isAuthenticated, resetPassword } = useSupabaseAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Redirect to dashboard if already signed in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const success = await resetPassword(email);
      if (success) {
        setEmailSent(true);
        toast.success("Password reset email sent! Check your inbox.");
      } else {
        toast.error("Failed to send reset email. Please try again.");
      }
    } catch (error: any) {
      toast.error("Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We've sent a password reset link to {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click the link in your email to reset your password. The link will expire in 24 hours.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline">
                <Link to="/login">Back to Login</Link>
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
              >
                Resend email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send reset email"}
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link to="/login">Back to Login</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
