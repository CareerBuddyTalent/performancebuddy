
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { reviews, goals, feedbackEntries, users, parameters } from "@/data/mockData";
import { PerformanceReview } from "@/types";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import TeamActivitySection from "@/components/dashboard/TeamActivitySection";
import AnalyticsContent from "@/components/dashboard/AnalyticsContent";

export default function Dashboard() {
  const { user } = useAuth();
  const [teamReviews, setTeamReviews] = useState<PerformanceReview[]>([]);
  const [myReviews, setMyReviews] = useState<PerformanceReview[]>([]);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  
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

  // Handle timeframe change for analytics dashboard
  const handleTimeframeChange = (newTimeframe: 'week' | 'month' | 'quarter' | 'year') => {
    setTimeframe(newTimeframe);
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <DashboardStats 
        user={user} 
        myReviews={myReviews} 
        teamReviews={teamReviews} 
        goals={goals}
        users={users}
      />
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <DashboardOverview 
            ratingsData={ratingsData} 
            userRole={user.role} 
            myReviews={myReviews} 
            teamReviews={teamReviews} 
          />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsContent 
            userRole={user.role} 
            timeframe={timeframe} 
            handleTimeframeChange={handleTimeframeChange} 
          />
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <TeamActivitySection recentActivity={recentActivity} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
