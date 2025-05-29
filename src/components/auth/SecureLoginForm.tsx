
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToggle } from "react-use";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Shield, Loader2 } from "lucide-react";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { useSecurityAudit } from "@/hooks/useSecurityAudit";
import { useSecureInput } from "@/hooks/useSecureInput";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

export function SecureLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, toggleShowPassword] = useToggle(false);
  const { secureLogin } = useSecureAuth();
  const { logAuthEvent } = useSecurityAudit();
  const { sanitizeEmail, validateEmail } = useSecureInput();
  const isMobile = useIsMobile();
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
        toast.success("Welcome back! 🎉");
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
        <Shield className="h-4 w-4 text-green-600" />
        <span className="text-green-700">Secure authentication enabled</span>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          maxLength={254}
          className={`${isMobile ? 'h-12' : 'h-10'} transition-all focus:ring-2 focus:ring-primary/20`}
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            minLength={8}
            className={`${isMobile ? 'h-12' : 'h-10'} pr-12 transition-all focus:ring-2 focus:ring-primary/20`}
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={`absolute right-2 top-1/2 -translate-y-1/2 ${isMobile ? 'h-8 w-8' : 'h-7 w-7'} rounded-full hover:bg-gray-100`}
            onClick={toggleShowPassword}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </Button>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className={`w-full ${isMobile ? 'h-12' : 'h-10'} bg-primary hover:bg-primary/90 transition-all`}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
      
      <div className="text-xs text-center text-gray-500 bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center justify-center gap-1">
          <Shield className="h-3 w-3" />
          Account locked after 5 failed attempts for security
        </div>
      </div>
    </form>
  );
}
