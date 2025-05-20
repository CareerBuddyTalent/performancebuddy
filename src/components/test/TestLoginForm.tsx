
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, ShieldCheck, Users } from "lucide-react";
import { TestUser } from "@/utils/testingUtils";

interface TestLoginFormProps {
  testUsers: TestUser[];
  onLogin: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export default function TestLoginForm({ testUsers, onLogin, isLoading, error }: TestLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Use predefined test user
  const handleSelectTestUser = (testUser: TestUser) => {
    setEmail(testUser.email);
    setPassword(testUser.password);
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="h-4 w-4" />;
      case 'manager':
        return <Users className="h-4 w-4" />;
      case 'employee':
        return <User className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Test Login</CardTitle>
        <CardDescription>
          Choose a test user or enter credentials manually
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Login</Label>
            <div className="grid grid-cols-1 gap-2">
              {testUsers.map((user) => (
                <Button
                  key={user.id}
                  variant="outline"
                  className="justify-start"
                  onClick={() => handleSelectTestUser(user)}
                >
                  {getRoleIcon(user.role)}
                  <span className="ml-2">
                    {user.name} ({user.role})
                  </span>
                </Button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="test@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login for Testing"}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
