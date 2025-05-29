
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToggle } from "react-use";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Shield } from "lucide-react";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { useSecurityAudit } from "@/hooks/useSecurityAudit";
import { useSecureInput } from "@/hooks/useSecureInput";
import { toast } from "sonner";

export function SecureLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, toggleShowPassword] = useToggle(false);
  const { secureLogin } = useSecureAuth();
  const { logAuthEvent } = useSecurityAudit();
  const { sanitizeEmail, validateEmail } = useSecureInput();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate inputs
      const sanitizedEmail = sanitizeEmail(email);
      const emailError = validateEmail(sanitizedEmail);
      
      if (emailError) {
        toast.error(emailError);
        setIsLoading(false);
        return;
      }

      if (!password || password.length < 8) {
        toast.error("Password must be at least 8 characters");
        setIsLoading(false);
        return;
      }

      const success = await secureLogin(sanitizedEmail, password);
      
      // Log the authentication attempt
      await logAuthEvent('login', success);
      
      if (success) {
        toast.success("Successfully signed in!");
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      await logAuthEvent('login', false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Shield className="h-4 w-4" />
        <span>Secure authentication enabled</span>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          maxLength={254}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            minLength={8}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={toggleShowPassword}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
      
      <div className="text-xs text-muted-foreground text-center">
        Account locked after 5 failed attempts for security
      </div>
    </form>
  );
}
