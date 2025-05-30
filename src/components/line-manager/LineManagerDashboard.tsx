
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Calendar, 
  MessageSquare, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { useRealPerformanceData } from '@/hooks/useRealPerformanceData';

export default function LineManagerDashboard() {
  const { user } = useSupabaseAuth();
  const { teamMembers, reviews, isLoading } = useRealPerformanceData();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || user.role !== 'manager') {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Access restricted to line managers only.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Loading team data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate team metrics
  const directReports = teamMembers.filter(member => member.manager === user.id);
  const pendingReviews = reviews.filter(r => 
    directReports.some(dr => dr.id === r.employee_id) && r.status === 'pending'
  );
  const completedReviews = reviews.filter(r => 
    directReports.some(dr => dr.id === r.employee_id) && r.status === 'completed'
  );
  const averageScore = completedReviews.length > 0
    ? completedReviews.reduce((sum, r) => sum + (r.overall_score || 0), 0) / completedReviews.length
    : 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team Management Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your direct reports, conduct 1:1s, and track team performance
        </p>
      </div>

      {/* Team Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Direct Reports</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{directReports.length}</div>
            <p className="text-xs text-muted-foreground">Team members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReviews.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Avg Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Out of 5.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">1:1s This Week</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Scheduled meetings</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Team Overview</TabsTrigger>
          <TabsTrigger value="reviews">Performance Reviews</TabsTrigger>
          <TabsTrigger value="oneOnOnes">1:1 Meetings</TabsTrigger>
          <TabsTrigger value="goals">Team Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Direct Reports</CardTitle>
              <CardDescription>
                Overview of your team members and their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {directReports.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-semibold text-muted-foreground">No Direct Reports</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      You currently have no team members assigned to you.
                    </p>
                  </div>
                ) : (
                  directReports.map((member) => {
                    const memberReviews = reviews.filter(r => r.employee_id === member.id);
                    const lastReview = memberReviews.sort((a, b) => 
                      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                    )[0];

                    return (
                      <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {member.name?.charAt(0) || member.email.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium">{member.name || member.email}</h4>
                            <p className="text-sm text-muted-foreground">
                              {member.position || 'Team Member'} • {member.department || 'No Department'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {lastReview && (
                            <Badge variant="outline">
                              Last review: {lastReview.overall_score}/5
                            </Badge>
                          )}
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Schedule 1:1
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Reviews</CardTitle>
              <CardDescription>
                Track and manage performance reviews for your direct reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.filter(r => directReports.some(dr => dr.id === r.employee_id)).length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-semibold text-muted-foreground">No Team Reviews</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      No performance reviews found for your team members.
                    </p>
                  </div>
                ) : (
                  reviews
                    .filter(r => directReports.some(dr => dr.id === r.employee_id))
                    .map((review) => {
                      const member = directReports.find(dr => dr.id === review.employee_id);
                      return (
                        <div key={review.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{member?.name || 'Unknown Member'}</h4>
                            <p className="text-sm text-muted-foreground">
                              {review.review_type} Review • {new Date(review.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={review.status === 'completed' ? 'default' : 'secondary'}
                            >
                              {review.status}
                            </Badge>
                            {review.overall_score && (
                              <Badge variant="outline">
                                {review.overall_score}/5
                              </Badge>
                            )}
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="oneOnOnes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>1:1 Meetings</CardTitle>
              <CardDescription>
                Schedule and track one-on-one meetings with your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold text-muted-foreground">1:1 Scheduling</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  1:1 meeting management features will be available soon.
                </p>
                <Button className="mt-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule 1:1
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Goals</CardTitle>
              <CardDescription>
                Monitor and cascade goals across your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Target className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold text-muted-foreground">Team Goal Management</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Team goal tracking and cascading features will be available soon.
                </p>
                <Button className="mt-4">
                  <Target className="h-4 w-4 mr-2" />
                  Create Team Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
