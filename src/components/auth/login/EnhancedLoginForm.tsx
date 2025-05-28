
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce, useToggle } from "react-use";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";
import { loginFormSchema, type LoginFormValues } from "./schema";

interface EnhancedLoginFormProps {
  onSubmit: (data: LoginFormValues) => Promise<void>;
  isLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
}

export function EnhancedLoginForm({ onSubmit, isLoading, authError, clearAuthError }: EnhancedLoginFormProps) {
  const [showPassword, toggleShowPassword] = useToggle(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const watchedEmail = form.watch("email");
  const watchedPassword = form.watch("password");

  // Debounce form validation to improve performance
  const [debouncedEmail] = useDebounce(watchedEmail, 300);
  const [debouncedPassword] = useDebounce(watchedPassword, 300);

  useEffect(() => {
    if (authError) {
      clearAuthError();
    }
  }, [debouncedEmail, debouncedPassword, authError, clearAuthError]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="your.email@example.com"
                  type="email"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    {...field}
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
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log in"}
        </Button>
      </form>
    </Form>
  );
}
