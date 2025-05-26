
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TestLoginForm from "@/components/test/TestLoginForm";
import RolePermissionsTable from "@/components/test/RolePermissionsTable";
import { UserMigrationPanel } from "@/components/admin/UserMigrationPanel";
import { Database, Users, Settings, ArrowRightLeft } from "lucide-react";

export default function TestingDashboard() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock test users for testing
  const testUsers = [
    { id: '1', email: 'admin@test.com', password: 'admin123', name: 'Admin User', role: 'admin' },
    { id: '2', email: 'manager@test.com', password: 'manager123', name: 'Manager User', role: 'manager' },
    { id: '3', email: 'employee@test.com', password: 'employee123', name: 'Employee User', role: 'employee' }
  ];

  const handleTestLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // This would integrate with your actual auth system
      console.log('Test login attempt:', { email, password });
      // For now, just simulate success
      setTimeout(() => {
        setIsLoading(false);
        console.log('Test login successful');
      }, 1000);
    } catch (error: any) {
      setAuthError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Database className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Testing Dashboard</h1>
      </div>

      <Tabs defaultValue="migration" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="migration" className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            User Migration
          </TabsTrigger>
          <TabsTrigger value="auth" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Authentication
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            System Info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="migration" className="space-y-4">
          <UserMigrationPanel />
        </TabsContent>

        <TabsContent value="auth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Testing</CardTitle>
              <CardDescription>
                Test authentication flows and user management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TestLoginForm 
                testUsers={testUsers}
                onLogin={handleTestLogin}
                isLoading={isLoading}
                error={authError}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role-Based Permissions</CardTitle>
              <CardDescription>
                View and test role-based access controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RolePermissionsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                Application configuration and environment details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Environment</h3>
                  <p className="text-sm text-muted-foreground">
                    {import.meta.env.MODE}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Authentication Provider</h3>
                  <p className="text-sm text-muted-foreground">
                    Clerk
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
