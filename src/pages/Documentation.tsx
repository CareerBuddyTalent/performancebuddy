
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import env from "@/config/env";

export default function Documentation() {
  const [activeTab, setActiveTab] = useState("user-guide");

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
            <p className="text-muted-foreground mt-1">
              User guides, API documentation, and deployment instructions
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            Version {env.APP_VERSION}
          </Badge>
        </div>

        <Tabs defaultValue="user-guide" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="user-guide">User Guide</TabsTrigger>
            <TabsTrigger value="api-docs">API Documentation</TabsTrigger>
            <TabsTrigger value="deployment">Deployment Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="user-guide" className="space-y-6">
            <UserGuide />
          </TabsContent>
          
          <TabsContent value="api-docs" className="space-y-6">
            <ApiDocumentation />
          </TabsContent>
          
          <TabsContent value="deployment" className="space-y-6">
            <DeploymentGuide />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}

function UserGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Guide</CardTitle>
        <CardDescription>How to use CareerBuddy features</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ScrollArea className="h-[600px] pr-4">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Getting Started</h2>
            <p>
              Welcome to CareerBuddy, your comprehensive employee success platform.
              This guide will help you navigate through the various features and functionalities
              of the application.
            </p>
            
            <h3 className="text-lg font-medium mt-4">Logging In</h3>
            <p>
              Access the application by navigating to the login page. Enter your email and password
              to access your account. If you don't have an account yet, click on "Sign up" to create one.
            </p>
            
            <Separator className="my-6" />
            
            <h3 className="text-lg font-medium">Dashboard</h3>
            <p>
              The dashboard provides an overview of your performance metrics, pending reviews,
              upcoming goals, and team activity. Use the quick stats cards to get a snapshot of your progress.
            </p>
            
            <Separator className="my-6" />
            
            <h3 className="text-lg font-medium">Performance Management</h3>
            <p>
              Track and manage your performance goals, review cycles, and feedback through the Performance section.
              Key features include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Setting and tracking personal and team goals</li>
              <li>Viewing performance trends and analytics</li>
              <li>Managing review cycles and feedback</li>
              <li>Creating and monitoring development plans</li>
            </ul>
            
            <Separator className="my-6" />
            
            <h3 className="text-lg font-medium">Skills Management</h3>
            <p>
              The Skills section helps you track, develop, and report on skills across your organization:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Skills catalog and categorization</li>
              <li>Role-based skill mappings</li>
              <li>Career path visualization and planning</li>
              <li>Skill gap analysis and development recommendations</li>
            </ul>
            
            <Separator className="my-6" />
            
            <h3 className="text-lg font-medium">User Management</h3>
            <p>
              For administrators and managers, the User Management section provides tools to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Manage user accounts and permissions</li>
              <li>Organize users by department and team</li>
              <li>View detailed user profiles and performance history</li>
              <li>Manage reporting relationships</li>
            </ul>
            
            <Separator className="my-6" />
            
            <h3 className="text-lg font-medium">Surveys</h3>
            <p>
              Create, distribute, and analyze surveys to gather feedback:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Create custom surveys with various question types</li>
              <li>Distribute surveys to specific teams or departments</li>
              <li>Analyze survey results with built-in analytics tools</li>
              <li>Track survey completion rates and send reminders</li>
            </ul>
            
            <Separator className="my-6" />
            
            <h3 className="text-lg font-medium">Settings</h3>
            <p>
              Customize your experience through the Settings page:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Update your personal profile information</li>
              <li>Configure notification preferences</li>
              <li>Manage email settings and subscriptions</li>
              <li>Set up data access controls and security settings</li>
            </ul>
          </section>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function ApiDocumentation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Documentation</CardTitle>
        <CardDescription>Integration points and API reference</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <section className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Authentication</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                All API requests require authentication using JWT tokens
              </p>
              
              <Card className="border-border/40">
                <CardHeader className="bg-muted/50 px-5 py-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">POST /auth/login</CardTitle>
                    <Badge>public</Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-5 py-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-sm">Request Body</h4>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-1 overflow-auto">
                      {JSON.stringify({
                        email: "user@example.com",
                        password: "password123"
                      }, null, 2)}
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm">Response</h4>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-1 overflow-auto">
                      {JSON.stringify({
                        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        user: {
                          id: "user-uuid",
                          name: "John Doe",
                          email: "user@example.com",
                          role: "employee"
                        }
                      }, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium">Performance Endpoints</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Endpoints for managing goals, reviews, and metrics
              </p>
              
              <Card className="border-border/40 mb-6">
                <CardHeader className="bg-muted/50 px-5 py-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">GET /api/goals</CardTitle>
                    <Badge>authorized</Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-5 py-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-sm">Query Parameters</h4>
                    <table className="w-full text-sm mt-1">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Parameter</th>
                          <th className="text-left py-2">Type</th>
                          <th className="text-left py-2">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">userId</td>
                          <td className="py-2">string</td>
                          <td className="py-2">Filter by user ID</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">status</td>
                          <td className="py-2">string</td>
                          <td className="py-2">Filter by status (active, completed, etc.)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm">Response</h4>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-1 overflow-auto">
                      {JSON.stringify({
                        data: [
                          {
                            id: "goal-1",
                            title: "Complete project X",
                            description: "Finish all deliverables for project X",
                            progress: 75,
                            status: "active",
                            dueDate: "2025-06-30"
                          },
                          {
                            id: "goal-2",
                            title: "Learning objectives",
                            description: "Complete React advanced course",
                            progress: 30,
                            status: "active",
                            dueDate: "2025-07-15"
                          }
                        ]
                      }, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border/40">
                <CardHeader className="bg-muted/50 px-5 py-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">POST /api/reviews</CardTitle>
                    <Badge>authorized</Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-5 py-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-sm">Request Body</h4>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-1 overflow-auto">
                      {JSON.stringify({
                        employeeId: "user-123",
                        reviewerId: "manager-456",
                        cycleId: "cycle-789",
                        ratings: [
                          { skillId: "skill-1", rating: 4 },
                          { skillId: "skill-2", rating: 5 }
                        ],
                        comments: "Great progress this quarter"
                      }, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium">Survey Endpoints</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Endpoints for managing surveys and responses
              </p>
              
              <Card className="border-border/40">
                <CardHeader className="bg-muted/50 px-5 py-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">GET /api/surveys</CardTitle>
                    <Badge>authorized</Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-5 py-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-sm">Response</h4>
                    <pre className="bg-muted p-2 rounded-md text-xs mt-1 overflow-auto">
                      {JSON.stringify({
                        data: [
                          {
                            id: "survey-1",
                            title: "Quarterly Engagement Survey",
                            status: "active",
                            questionCount: 10,
                            responseCount: 45,
                            dueDate: "2025-06-15"
                          },
                          {
                            id: "survey-2",
                            title: "Team Satisfaction Poll",
                            status: "draft",
                            questionCount: 5,
                            responseCount: 0,
                            dueDate: null
                          }
                        ]
                      }, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Separator />
            
            <div className="mt-6">
              <h3 className="text-lg font-medium">Webhooks</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Configure webhooks to receive real-time notifications
              </p>
              
              <Card className="border-border/40">
                <CardHeader className="bg-muted/50 px-5 py-3">
                  <CardTitle className="text-base">Event Types</CardTitle>
                </CardHeader>
                <CardContent className="px-5 py-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Event</th>
                        <th className="text-left py-2">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">goal.created</td>
                        <td className="py-2">Triggered when a new goal is created</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">review.submitted</td>
                        <td className="py-2">Triggered when a review is submitted</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">survey.completed</td>
                        <td className="py-2">Triggered when a survey is completed by a user</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </section>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function DeploymentGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment Guide</CardTitle>
        <CardDescription>Instructions for deploying CareerBuddy</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <section className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Prerequisites</h3>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Node.js (v16 or later)</li>
                <li>npm or Yarn package manager</li>
                <li>A Supabase account for database and authentication</li>
                <li>Environment variables configured (see below)</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium">Environment Setup</h3>
              <p className="mt-2 mb-4">
                Create a <code>.env</code> file at the root of your project with the following variables:
              </p>
              
              <pre className="bg-muted p-4 rounded-md text-xs overflow-auto">
{`VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_NAME=CareerBuddy
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=true or false`}
              </pre>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium">Build for Production</h3>
              <p className="mt-2">Run the build command to create optimized production files:</p>
              
              <pre className="bg-muted p-4 rounded-md text-xs mt-2 overflow-auto">
{`npm run build

# or with Yarn
yarn build`}
              </pre>
              
              <p className="mt-4">
                This will generate a <code>dist</code> directory with the compiled application.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium">Deployment Options</h3>
              
              <h4 className="font-medium mt-6">1. Static Hosting</h4>
              <p className="mt-2">
                Deploy the contents of the <code>dist</code> directory to any static hosting service:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Netlify</li>
                <li>Vercel</li>
                <li>GitHub Pages</li>
                <li>Firebase Hosting</li>
                <li>AWS S3 + CloudFront</li>
              </ul>
              
              <h4 className="font-medium mt-6">2. Containerized Deployment</h4>
              <p className="mt-2">
                Use the provided Dockerfile to build and deploy a containerized version:
              </p>
              
              <pre className="bg-muted p-4 rounded-md text-xs mt-2 overflow-auto">
{`# Build the Docker image
docker build -t careerbuddy:latest .

# Run the container
docker run -p 8080:80 careerbuddy:latest`}
              </pre>
              
              <h4 className="font-medium mt-6">3. CI/CD Pipeline</h4>
              <p className="mt-2">
                The project includes a GitHub Action workflow in <code>.github/workflows/deploy.yml</code> that:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Builds the application on push to main/master branch</li>
                <li>Runs tests to ensure quality</li>
                <li>Deploys to production (needs configuration)</li>
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium">Database Setup</h3>
              <p className="mt-2">
                CareerBuddy uses Supabase for its backend. Follow these steps to set up your database:
              </p>
              
              <ol className="list-decimal pl-6 space-y-2 mt-2">
                <li>Create a Supabase project from their dashboard</li>
                <li>Run the SQL migration scripts provided in <code>supabase/migrations</code></li>
                <li>Configure authentication providers as needed</li>
                <li>Set up storage buckets if using file uploads</li>
                <li>Configure Row-Level Security policies to match your needs</li>
              </ol>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium">Post-Deployment Verification</h3>
              <p className="mt-2">After deployment, verify the following:</p>
              
              <ol className="list-decimal pl-6 space-y-2 mt-2">
                <li>User authentication works correctly</li>
                <li>All API endpoints are accessible</li>
                <li>Database connections are functioning properly</li>
                <li>File uploads and storage are working as expected</li>
                <li>Run performance tests using the built-in testing utilities</li>
              </ol>
            </div>
            
            <div className="pt-6">
              <h3 className="text-lg font-medium">Troubleshooting</h3>
              <p className="mt-2">If you encounter issues during deployment:</p>
              
              <ol className="list-decimal pl-6 space-y-2 mt-2">
                <li>Check environment variables are correctly set</li>
                <li>Verify database connection and credentials</li>
                <li>Check browser console for JavaScript errors</li>
                <li>Verify API endpoints are responding correctly</li>
                <li>Check server logs for backend errors</li>
              </ol>
            </div>
          </section>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
