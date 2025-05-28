import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

export default function AdvancedAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    weeklyGrowth: 0,
    averageSessionDuration: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useSupabaseAuth();

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchData = async () => {
      setLoading(true);
      // Replace this with your actual data fetching logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setData({
        totalUsers: 150,
        activeUsers: 75,
        weeklyGrowth: 5,
        averageSessionDuration: 180,
      });
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Advanced Analytics</h1>
        <p className="text-muted-foreground">
          Gain deeper insights into your application's performance and user
          behavior.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-background border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="user-engagement">User Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="custom-reports">Custom Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
                <CardDescription>Total number of registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "Loading..." : data.totalUsers}</div>
                <p className="text-sm text-muted-foreground">
                  {loading ? "" : "Since last month"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
                <CardDescription>Number of users active in the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "Loading..." : data.activeUsers}</div>
                <p className="text-sm text-muted-foreground">
                  {loading ? "" : "30-day active users"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Weekly Growth</CardTitle>
                <CardDescription>Percentage increase in users this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "Loading..." : `${data.weeklyGrowth}%`}</div>
                <p className="text-sm text-muted-foreground">
                  {loading ? "" : "Compared to last week"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Avg. Session Duration</CardTitle>
                <CardDescription>Average time users spend on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loading ? "Loading..." : `${data.averageSessionDuration}s`}</div>
                <p className="text-sm text-muted-foreground">
                  {loading ? "" : "Average session length"}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>User Activity Log</CardTitle>
              <CardDescription>
                A real-time log of user actions and events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>User activity log content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="user-engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Engagement Metrics</CardTitle>
              <CardDescription>
                Track how users are interacting with your application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>User engagement metrics content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Monitor the performance of your application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Performance metrics content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom-reports" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Custom Reports</h2>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Create Custom Reports</CardTitle>
              <CardDescription>
                Design and generate custom reports based on your specific needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Custom report creation tools will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
