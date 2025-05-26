
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Target, TrendingUp, Calendar, Plus, Settings } from "lucide-react";
import { useClerkAuth } from "@/context/ClerkAuthContext";
import { useRealPerformanceData } from "@/hooks/useRealPerformanceData";
import { useRealDashboardData } from "@/hooks/useRealDashboardData";

export default function HRManagerDashboard() {
  const { user } = useClerkAuth();
  const { teamMembers, reviews, isLoading: performanceLoading } = useRealPerformanceData();
  const { stats, isLoading: dashboardLoading } = useRealDashboardData();

  if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Access denied. Manager or admin role required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (performanceLoading || dashboardLoading) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Loading dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingReviews = reviews.filter(r => r.status === 'pending').length;
  const completedReviews = reviews.filter(r => r.status === 'completed').length;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">HR Manager Dashboard</h1>
          <p className="text-muted-foreground">
            Manage performance reviews, team goals, and employee development
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Review Cycle
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Team Members</p>
              <p className="text-2xl font-bold">{teamMembers.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
              <p className="text-2xl font-bold">{pendingReviews}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed Reviews</p>
              <p className="text-2xl font-bold">{completedReviews}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Goals</p>
              <p className="text-2xl font-bold">{stats.totalGoals - stats.completedGoals}</p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>Latest performance review activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Review #{review.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {review.review_type} • {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={
                    review.status === 'completed' ? 'default' :
                    review.status === 'pending' ? 'secondary' : 'outline'
                  }>
                    {review.status}
                  </Badge>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No reviews yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Overview</CardTitle>
            <CardDescription>Your direct reports and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.slice(0, 5).map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.position || member.role}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{member.role}</Badge>
                </div>
              ))}
              {teamMembers.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No team members assigned</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Action Items</CardTitle>
          <CardDescription>Tasks that need your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingReviews > 0 && (
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium">Complete pending reviews</p>
                    <p className="text-sm text-muted-foreground">{pendingReviews} reviews awaiting completion</p>
                  </div>
                </div>
                <Button size="sm">Review</Button>
              </div>
            )}
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Schedule 1:1 meetings</p>
                  <p className="text-sm text-muted-foreground">Regular check-ins with team members</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Schedule</Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Review team goals</p>
                  <p className="text-sm text-muted-foreground">Assess progress and adjust targets</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Review</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
