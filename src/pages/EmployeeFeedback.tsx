import React, { useState } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, CheckCheck, MessageSquare } from "lucide-react";

export default function EmployeeFeedback() {
  const { user } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Sample employee data - in a real app, this would come from an API
  const employee = {
    name: "Jane Doe",
    title: "Software Engineer",
    department: "Engineering",
    startDate: "2022-08-15",
    performanceScore: 85,
    engagementScore: 92,
    skills: ["React", "Node.js", "JavaScript", "TypeScript"],
    avatarUrl: "https://avatars.dicebear.com/api/ নারী/jane_doe.svg"
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Employee Feedback</h1>
        <p className="text-muted-foreground">
          View and manage feedback for your employees
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Overview</CardTitle>
          <CardDescription>
            Summary of employee performance and engagement
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={employee.avatarUrl} alt={employee.name} />
              <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{employee.name}</p>
              <p className="text-sm text-muted-foreground">{employee.title}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Department</p>
            <p className="text-lg">{employee.department}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Start Date</p>
            <p className="text-lg">{new Date(employee.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Performance Score</p>
            <p className="text-lg">{employee.performanceScore}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Engagement Score</p>
            <p className="text-lg">{employee.engagementScore}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Skills</p>
            <div className="flex flex-wrap gap-1">
              {employee.skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-background border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance Reviews</TabsTrigger>
          <TabsTrigger value="feedback">Continuous Feedback</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates and feedback for this employee
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-none space-y-4">
                <li className="flex items-center space-x-4">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Performance Review Due</p>
                    <p className="text-xs text-muted-foreground">Due in 14 days</p>
                  </div>
                </li>
                <li className="flex items-center space-x-4">
                  <CheckCheck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Goal Completed</p>
                    <p className="text-xs text-muted-foreground">Increased sales by 20%</p>
                  </div>
                </li>
                <li className="flex items-center space-x-4">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">New Feedback Received</p>
                    <p className="text-xs text-muted-foreground">Positive feedback on project X</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reviews</CardTitle>
              <CardDescription>
                Past performance reviews and upcoming reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Performance review content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Continuous Feedback</CardTitle>
              <CardDescription>
                Real-time feedback and suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Continuous feedback content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Goals</CardTitle>
              <CardDescription>
                Employee goals and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Employee goals content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
