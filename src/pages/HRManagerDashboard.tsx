import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

export default function HRManagerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useSupabaseAuth();
  const [teamSize, setTeamSize] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);

  useEffect(() => {
    // Mock data fetching - replace with actual API calls
    const fetchDashboardData = async () => {
      // Simulate fetching team size
      setTimeout(() => {
        setTeamSize(12);
      }, 500);

      // Simulate fetching pending reviews
      setTimeout(() => {
        setPendingReviews(3);
      }, 750);
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">HR Manager Dashboard</h1>
        <p className="text-muted-foreground">
          Manage employee performance, reviews, and overall HR activities
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Team Size</CardTitle>
            <CardDescription>Total number of employees in your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamSize}</div>
            <p className="text-sm text-muted-foreground">
              {teamSize > 10 ? "Large team" : "Manageable size"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Reviews</CardTitle>
            <CardDescription>Employee performance reviews awaiting your action</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReviews}</div>
            <p className="text-sm text-muted-foreground">
              <Badge variant={pendingReviews > 0 ? "destructive" : "secondary"}>
                {pendingReviews > 0 ? "Action Required" : "All clear"}
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employee Satisfaction</CardTitle>
            <CardDescription>Overall satisfaction level of your employees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2/5</div>
            <p className="text-sm text-muted-foreground">
              Based on recent survey results
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Performance Goals</CardTitle>
            <CardDescription>Number of performance goals currently in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-sm text-muted-foreground">
              Track progress and provide feedback
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-background border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance Reviews</TabsTrigger>
          <TabsTrigger value="feedback">Employee Feedback</TabsTrigger>
          <TabsTrigger value="goals">Performance Goals</TabsTrigger>
          <TabsTrigger value="training">Training & Development</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Overview</CardTitle>
              <CardDescription>
                Key metrics and insights into your team's performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Team performance overview content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reviews</CardTitle>
              <CardDescription>
                Manage and track employee performance reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Performance review management content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Feedback</CardTitle>
              <CardDescription>
                Collect and analyze employee feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Employee feedback analysis content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Goals</CardTitle>
              <CardDescription>
                Set and track employee performance goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Performance goal management content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training & Development</CardTitle>
              <CardDescription>
                Manage employee training and development programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Training and development management content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
