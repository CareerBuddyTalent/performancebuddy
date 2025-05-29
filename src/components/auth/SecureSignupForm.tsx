
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToggle } from "react-use";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Shield } from "lucide-react";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { useSecurityAudit } from "@/hooks/useSecurityAudit";
import { useSecureInput } from "@/hooks/useSecureInput";
import { toast } from "sonner";

export function SecureSignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, toggleShowPassword] = useToggle(false);
  const { secureSignup } = useSecureAuth();
  const { logAuthEvent } = useSecurityAudit();
  const { sanitizeText, sanitizeEmail, validateEmail, validateRequired, validateTextLength } = useSecureInput();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate and sanitize inputs
      const sanitizedName = sanitizeText(name);
      const sanitizedEmail = sanitizeEmail(email);
      
      const nameError = validateRequired(sanitizedName, "Name") || 
                       validateTextLength(sanitizedName, 2, 100, "Name");
      const emailError = validateEmail(sanitizedEmail);
      
      if (nameError) {
        toast.error(nameError);
        setIsLoading(false);
        return;
      }
      
      if (emailError) {
        toast.error(emailError);
        setIsLoading(false);
        return;
      }

      const success = await secureSignup(sanitizedName, sanitizedEmail, password);
      
      // Log the authentication attempt
      await logAuthEvent('signup', success);
      
      if (success) {
        navigate("/login");
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Shield className="h-4 w-4" />
        <span>Enhanced security requirements</span>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          maxLength={100}
        />
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
            minLength={8}
            autoComplete="new-password"
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
        <div className="text-xs text-muted-foreground">
          Must include: 8+ characters, uppercase, lowercase, number, and special character
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
