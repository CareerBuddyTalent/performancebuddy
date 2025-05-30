
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToggle } from "react-use";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Shield, Loader2 } from "lucide-react";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { useSecurityAudit } from "@/hooks/useSecurityAudit";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

export function SecureSignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, toggleShowPassword] = useToggle(false);
  const { signup } = useSupabaseAuth();
  const { logAuthEvent } = useSecurityAudit();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const validatePasswordStrength = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push("at least 8 characters");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("one uppercase letter");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("one lowercase letter");
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push("one number");
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("one special character");
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signup) {
      toast.error("Authentication service not available");
      return;
    }

    setIsLoading(true);

    try {
      // Basic validation
      if (!name.trim() || !email.trim() || !password) {
        toast.error("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        toast.error("Please enter a valid email address");
        setIsLoading(false);
        return;
      }

      // Enhanced password validation
      const passwordErrors = validatePasswordStrength(password);
      if (passwordErrors.length > 0) {
        toast.error(`Password requirements: ${passwordErrors.join(', ')}`);
        setIsLoading(false);
        return;
      }

      console.log("Attempting signup with email:", email.trim());
      const success = await signup(name.trim(), email.trim().toLowerCase(), password);
      
      if (success) {
        await logAuthEvent('signup', true);
        toast.success("Account created successfully! Please check your email to verify your account.");
        navigate("/login");
      } else {
        await logAuthEvent('signup', false);
        toast.error("Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      await logAuthEvent('signup', false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
        <Shield className="h-4 w-4 text-green-600" />
        <span className="text-green-700">Enhanced security requirements</span>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          className={`${isMobile ? 'h-12' : 'h-10'} transition-all focus:ring-2 focus:ring-primary/20`}
          disabled={isLoading}
          maxLength={100}
        />
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
          className={`${isMobile ? 'h-12' : 'h-10'} transition-all focus:ring-2 focus:ring-primary/20`}
          disabled={isLoading}
          maxLength={254}
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
            minLength={8}
            autoComplete="new-password"
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
        <div className="text-xs text-muted-foreground">
          Must include: 8+ characters, uppercase, lowercase, number, and special character
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
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
      
      <div className="text-xs text-center text-gray-500 bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center justify-center gap-1">
          <Shield className="h-3 w-3" />
          Enhanced security with enterprise-grade protection
        </div>
      </div>
    </form>
  );
}
