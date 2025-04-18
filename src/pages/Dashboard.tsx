
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { reviews, goals, feedbackEntries, users, parameters } from "@/data/mockData";
import { PerformanceReview } from "@/types";
import UserPerformanceRanking from "@/components/UserPerformanceRanking";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import TeamActivitySection from "@/components/dashboard/TeamActivitySection";
import AnalyticsContent from "@/components/dashboard/AnalyticsContent";
import EmployeeDashboard from "@/components/dashboard/employee";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

// Mock data for recent activity
const recentActivity = [
  {
    type: "review",
    date: new Date(2025, 3, 16),
    data: { reviewId: "r123" },
    message: "Alex Chen completed a performance review for Sarah Johnson",
    user: {
      name: "Alex Chen",
      avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png",
    }
  },
  {
    type: "goal",
    date: new Date(2025, 3, 15),
    data: { goalId: "g456" },
    message: "Marcus Wong set a new quarterly goal: Improve team velocity by 15%",
    user: {
      name: "Marcus Wong",
      avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png",
    }
  },
  {
    type: "feedback",
    date: new Date(2025, 3, 14),
    data: { feedbackId: "f789" },
    message: "Emily Davis provided positive feedback for the product team",
    user: {
      name: "Emily Davis",
      avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png",
    }
  },
  {
    type: "system",
    date: new Date(2025, 3, 12),
    data: { cycleId: "c101" },
    message: "Q2 Performance Review cycle has been initiated by the system",
  }
];

export default function Dashboard() {
  const { user } = useAuth();
  const [teamReviews, setTeamReviews] = useState<PerformanceReview[]>([]);
  const [myReviews, setMyReviews] = useState<PerformanceReview[]>([]);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!user) return;

    console.log("Dashboard - Current user role:", user.role);

    // Filter reviews based on user role
    if (user.role === 'admin') {
      setTeamReviews(reviews);
      console.log("Admin dashboard loaded with all reviews");
    } else if (user.role === 'manager') {
      setTeamReviews(reviews.filter(review => review.reviewerId === user.id));
      console.log("Manager dashboard loaded with filtered reviews");
    }
    
    setMyReviews(reviews.filter(review => review.employeeId === user.id));
    
    if (user.role === 'admin') {
      toast.success(`Welcome, Administrator ${user.name}!`);
    } else if (user.role === 'manager') {
      toast.success(`Welcome, Manager ${user.name}!`);
    } else {
      toast.success(`Welcome, ${user.name}!`);
    }
  }, [user]);

  // Filter users based on role
  const getRelevantUsers = () => {
    if (!user) return [];
    
    if (user.role === 'admin') {
      return users; // All users for admin
    } else if (user.role === 'manager') {
      // Only team members for managers
      return users.filter(u => u.manager === user.name);
    }
    return [];
  };

  if (!user) {
    console.log("Dashboard - No user found, rendering null");
    return null;
  }
  
  // Render employee dashboard for employee users
  if (user.role === 'employee') {
    console.log("Rendering employee dashboard");
    return (
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        <EmployeeDashboard 
          reviews={reviews}
          goals={goals}
          feedbackEntries={feedbackEntries}
          users={users}
          parameters={parameters}
        />
      </div>
    );
  }

  // Render manager/admin dashboard with top performers
  console.log("Rendering manager/admin dashboard");
  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <DashboardStats 
        user={user} 
        myReviews={myReviews} 
        teamReviews={teamReviews} 
        goals={goals}
        users={users}
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        {user.role === 'manager' && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                Team Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UserPerformanceRanking users={getRelevantUsers()} limit={5} />
            </CardContent>
          </Card>
        )}
        
        {(user.role === 'admin' || user.role === 'manager') && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                Company Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UserPerformanceRanking users={users} limit={5} />
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="analytics" className="px-3 py-1.5">Analytics</TabsTrigger>
          <TabsTrigger value="activity" className="px-3 py-1.5">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="space-y-4 mt-4">
          <AnalyticsContent 
            userRole={user.role} 
            timeframe={timeframe} 
            handleTimeframeChange={setTimeframe} 
          />
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4 mt-4">
          <TeamActivitySection recentActivity={recentActivity} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
