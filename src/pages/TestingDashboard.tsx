
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  XCircle, 
  User, 
  Users, 
  ShieldCheck, 
  ArrowRight
} from "lucide-react";
import { testUsers, loginTestUser, runAdminTests, runManagerTests, runEmployeeTests, testComponentRendering } from "@/utils/testingUtils";
import { User as UserType } from "@/types";

export default function TestingDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [currentTestUser, setCurrentTestUser] = useState<UserType | null>(null);

  // Determine the role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="h-5 w-5" />;
      case 'manager':
        return <Users className="h-5 w-5" />;
      case 'employee':
        return <User className="h-5 w-5" />;
      default:
        return null;
    }
  };

  // Login as test user
  const handleLoginAsUser = async (testUser: typeof testUsers[0]) => {
    try {
      // First logout current user
      if (user) {
        await logout();
      }

      // Login as new user
      const loggedInUser = await loginTestUser(testUser.email, testUser.password);
      if (loggedInUser) {
        setCurrentTestUser(loggedInUser);
      }
    } catch (error: any) {
      console.error("Login error:", error.message);
    }
  };

  // Run tests for current role
  const handleRunTests = async () => {
    if (!currentTestUser) return;
    
    setIsRunningTests(true);
    setTestResults([`Starting tests for ${currentTestUser.role}...`]);
    
    try {
      let results: {success: boolean; results: string[]};
      
      // Run role-specific tests
      switch (currentTestUser.role) {
        case 'admin':
          results = await runAdminTests();
          break;
        case 'manager':
          results = await runManagerTests();
          break;
        case 'employee':
          results = await runEmployeeTests();
          break;
        default:
          results = { success: false, results: ['Unknown role'] };
      }
      
      // Add component rendering tests
      const componentResults = testComponentRendering();
      
      setTestResults([
        ...results.results,
        '',
        'Component Rendering Tests:',
        ...componentResults
      ]);
    } catch (error: any) {
      setTestResults(prev => [...prev, `Error running tests: ${error.message}`]);
    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Testing Dashboard</h1>
          <p className="text-muted-foreground">
            Test user roles and application features
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="features">Feature Tests</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Testing Plan Overview</CardTitle>
              <CardDescription>
                This dashboard allows you to test all features for each user role
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {testUsers.map((testUser) => (
                  <Card key={testUser.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getRoleIcon(testUser.role)}
                          {testUser.name}
                        </CardTitle>
                        <Badge>{testUser.role}</Badge>
                      </div>
                      <CardDescription>{testUser.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">
                        Use this account to test {testUser.role} features and permissions.
                      </p>
                      <Button 
                        onClick={() => handleLoginAsUser(testUser)} 
                        className="w-full"
                      >
                        Login as {testUser.role}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Alert>
                <AlertTitle>Current Test User</AlertTitle>
                <AlertDescription>
                  {currentTestUser ? (
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{currentTestUser.role}</Badge>
                      <span>{currentTestUser.name} ({currentTestUser.email})</span>
                    </div>
                  ) : (
                    <span>No test user is currently active</span>
                  )}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="auth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Testing</CardTitle>
              <CardDescription>
                Test login, logout, and permission checks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Login Tests</h3>
                  <div className="space-y-2">
                    {testUsers.map((testUser) => (
                      <Button 
                        key={testUser.id}
                        onClick={() => handleLoginAsUser(testUser)} 
                        variant="outline"
                        className="w-full justify-start"
                      >
                        {getRoleIcon(testUser.role)}
                        <span className="ml-2">Login as {testUser.role}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Authentication Status</h3>
                  <Card className="p-4">
                    {currentTestUser ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="text-green-500 h-5 w-5" />
                          <span>Authenticated as {currentTestUser.role}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          You can now test features available to this role
                        </p>
                        <Button onClick={() => logout()} variant="destructive" size="sm">
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <XCircle className="text-red-500 h-5 w-5" />
                          <span>Not authenticated</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Login as a test user to begin testing
                        </p>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Testing</CardTitle>
              <CardDescription>
                Run tests on role-specific features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentTestUser ? (
                <div className="space-y-4">
                  <Alert>
                    <AlertTitle>Current Test User: {currentTestUser.role}</AlertTitle>
                    <AlertDescription>
                      Running tests for {currentTestUser.name} ({currentTestUser.email})
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">{currentTestUser.role.charAt(0).toUpperCase() + currentTestUser.role.slice(1)} Features</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click the button below to run tests for all features available to {currentTestUser.role}s
                    </p>
                    <Button 
                      onClick={handleRunTests}
                      disabled={isRunningTests}
                    >
                      {isRunningTests ? "Running Tests..." : "Run Feature Tests"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6">
                  <h3 className="font-medium mb-2">No active test user</h3>
                  <p className="text-muted-foreground mb-4">
                    Please login as a test user to run feature tests
                  </p>
                  <Button 
                    onClick={() => setActiveTab("auth")}
                    variant="outline"
                  >
                    Go to Authentication
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                View results from your last test run
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.length > 0 ? (
                <div className="bg-muted p-4 rounded-md">
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {testResults.map((result, index) => (
                      <div key={index}>{result}</div>
                    ))}
                  </pre>
                </div>
              ) : (
                <div className="text-center p-6">
                  <p className="text-muted-foreground">No test results yet</p>
                  <Button 
                    onClick={() => setActiveTab("features")}
                    variant="outline"
                    className="mt-4"
                  >
                    Run Tests
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
