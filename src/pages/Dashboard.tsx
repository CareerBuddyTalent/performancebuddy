
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewProgress from "@/components/ReviewProgress";
import RatingsGraph from "@/components/RatingsGraph";
import { reviews, goals, feedbackEntries, users, parameters } from "@/data/mockData";
import { PerformanceReview } from "@/types";

export default function Dashboard() {
  const { user } = useAuth();
  const [teamReviews, setTeamReviews] = useState<PerformanceReview[]>([]);
  const [myReviews, setMyReviews] = useState<PerformanceReview[]>([]);
  
  useEffect(() => {
    if (!user) return;

    // Filter reviews based on user role
    if (user.role === 'admin') {
      // Admin sees all reviews
      setTeamReviews(reviews);
    } else if (user.role === 'manager') {
      // Manager sees reviews where they are the reviewer
      setTeamReviews(reviews.filter(review => review.reviewerId === user.id));
    }
    
    // Set reviews where user is the employee being reviewed
    setMyReviews(reviews.filter(review => review.employeeId === user.id));
  }, [user]);

  // Calculate review stats
  const totalTeamReviews = teamReviews.length;
  const completedTeamReviews = teamReviews.filter(r => r.status === 'submitted' || r.status === 'acknowledged').length;
  const inProgressTeamReviews = teamReviews.filter(r => r.status === 'in_progress').length;
  const notStartedTeamReviews = teamReviews.filter(r => r.status === 'not_started').length;

  // Prepare ratings data for graph
  const ratingsData = parameters.map(param => {
    // Calculate average rating for this parameter across all reviews
    const paramRatings = reviews.flatMap(review => 
      review.ratings.filter(r => r.parameterId === param.id && r.score > 0)
    );
    
    const averageScore = paramRatings.length > 0 
      ? paramRatings.reduce((sum, rating) => sum + rating.score, 0) / paramRatings.length
      : 0;
    
    return {
      name: param.name,
      score: parseFloat(averageScore.toFixed(1)),
      color: '#9B87F5'
    };
  });

  // Recent activity logic
  const recentActivity = [
    ...reviews.map(review => ({
      type: 'review',
      date: review.updatedAt,
      data: review,
      message: `Review ${review.status === 'submitted' ? 'submitted' : 'updated'} for ${users.find(u => u.id === review.employeeId)?.name}`
    })),
    ...goals.map(goal => ({
      type: 'goal',
      date: goal.updatedAt,
      data: goal,
      message: `Goal "${goal.title}" ${goal.status === 'completed' ? 'completed' : 'updated'} by ${users.find(u => u.id === goal.userId)?.name}`
    })),
    ...feedbackEntries.map(feedback => ({
      type: 'feedback',
      date: feedback.createdAt,
      data: feedback,
      message: `New feedback provided to ${users.find(u => u.id === feedback.recipientId)?.name}`
    }))
  ]
  .sort((a, b) => b.date.getTime() - a.date.getTime())
  .slice(0, 5);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Total Reviews</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.role === 'employee' ? myReviews.length : totalTeamReviews}</div>
            <p className="text-xs text-muted-foreground">Current review period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Completed</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.role === 'employee' ? myReviews.filter(r => r.status === 'submitted' || r.status === 'acknowledged').length : completedTeamReviews}</div>
            <p className="text-xs text-muted-foreground">
              {user.role === 'employee' ? 'Reviews you\'ve acknowledged' : 'Submitted reviews'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">In Progress</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.role === 'employee' ? myReviews.filter(r => r.status === 'in_progress').length : inProgressTeamReviews}</div>
            <p className="text-xs text-muted-foreground">Reviews being worked on</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Goals</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.role === 'employee' 
                ? goals.filter(g => g.userId === user.id).length 
                : goals.filter(g => {
                    const goalUser = users.find(u => u.id === g.userId);
                    return goalUser && goalUser.manager === user.id;
                  }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {user.role === 'employee' ? 'Your active goals' : 'Team goals being tracked'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
              <RatingsGraph 
                data={ratingsData} 
                title="Performance Ratings" 
                description="Average ratings across all review parameters"
              />
            </div>
            <div className="col-span-3">
              <ReviewProgress
                totalReviews={user.role === 'employee' ? myReviews.length : totalTeamReviews}
                completedReviews={user.role === 'employee' ? myReviews.filter(r => r.status === 'submitted' || r.status === 'acknowledged').length : completedTeamReviews}
                inProgressReviews={user.role === 'employee' ? myReviews.filter(r => r.status === 'in_progress').length : inProgressTeamReviews}
                notStartedReviews={user.role === 'employee' ? myReviews.filter(r => r.status === 'not_started').length : notStartedTeamReviews}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Your performance data over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">
                  Historical performance data will be shown here in future versions.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>The latest updates in your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 rtl:space-x-reverse">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div className="space-y-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.date.toLocaleDateString()} at {activity.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No recent activity to show.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
