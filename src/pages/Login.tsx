import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { users } from "@/data/mockData";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Login() {
  const { login, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      clearAuthError();
    };
  }, [clearAuthError]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const subscription = form.watch(() => {
      if (authError) {
        clearAuthError();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, authError, clearAuthError]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      console.log("Login attempt with:", data.email);
      const success = await login(data.email, data.password);
      
      if (success) {
        toast.success(`Logged in successfully!`);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const demoEmployee = users.find(u => u.role === 'employee');
  const demoManager = users.find(u => u.role === 'manager');
  const demoAdmin = users.find(u => u.role === 'admin');

  const fillDemoCredentials = (email: string) => {
    form.setValue('email', email);
    form.setValue('password', 'password123');
  };

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
                        <Input
                          placeholder="••••••••"
                          type="password"
                          autoComplete="current-password"
                          {...field}
                        />
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

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Demo Accounts</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {demoEmployee && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fillDemoCredentials(demoEmployee.email)}
                    className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                  >
                    Employee
                  </Button>
                )}
                
                {demoManager && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fillDemoCredentials(demoManager.email)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    Manager
                  </Button>
                )}
                
                {demoAdmin && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fillDemoCredentials(demoAdmin.email)}
                    className="text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                  >
                    Admin
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
            <p className="text-xs text-center text-muted-foreground">
              For demo accounts, use password: <code className="bg-muted px-1 py-0.5 rounded">password123</code>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
