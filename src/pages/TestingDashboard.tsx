
import { useClerkAuth } from "@/context/ClerkAuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TestingDashboard() {
  const { user } = useClerkAuth();

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Access denied. Admin role required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Testing Dashboard</h1>
        <p className="text-muted-foreground">
          Admin testing and debugging tools
        </p>
      </div>

      <Tabs defaultValue="auth" className="space-y-4">
        <TabsList>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="auth">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
              <CardDescription>
                Current user authentication details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">User ID</p>
                  <p className="text-sm text-muted-foreground">{user.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database Status</CardTitle>
              <CardDescription>
                Database connection and table status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Database testing tools will be available soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Permission Testing</CardTitle>
              <CardDescription>
                Test role-based access controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Permission testing tools will be available soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
