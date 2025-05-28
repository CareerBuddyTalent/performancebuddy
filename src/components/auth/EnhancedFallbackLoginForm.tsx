
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce, useToggle } from "react-use";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useClerkAuth } from "@/context/ClerkAuthContext";
import { toast } from "sonner";

export function EnhancedFallbackLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, toggleShowPassword] = useToggle(false);
  const { login } = useClerkAuth();
  const navigate = useNavigate();

  // Debounce email validation
  const [debouncedEmail] = useDebounce(() => {
    // Could add email validation logic here
    return email;
  }, 300, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login) return;

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Successfully signed in!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        Demo mode: Use any email and password to sign in
      </div>
    </form>
  );
}
