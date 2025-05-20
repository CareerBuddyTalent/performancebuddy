
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabaseClient } from "@/integrations/supabase/client";
import TestLoginForm from "@/components/test/TestLoginForm";
import { testUsers } from "@/utils/testingUtils";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    await performLogin(email, password);
  };
  
  const performLogin = async (loginEmail: string, loginPassword: string) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (error: any) {
      setAuthError(error.message || "Failed to log in");
      toast.error(error.message || "Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = async (testEmail: string, testPassword: string) => {
    await performLogin(testEmail, testPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="test">Test Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Login</CardTitle>
              <CardDescription>
                Enter your email and password to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <div className="text-center text-sm">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="test">
          <TestLoginForm 
            testUsers={testUsers}
            onLogin={handleTestLogin}
            isLoading={isLoading}
            error={authError}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
