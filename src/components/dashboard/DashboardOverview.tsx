
import RatingsGraph from "@/components/RatingsGraph";
import ReviewProgress from "@/components/ReviewProgress";
import { PerformanceReview } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardOverviewProps {
  ratingsData: Array<{ name: string; score: number; color: string }>;
  userRole: string;
  myReviews: PerformanceReview[];
  teamReviews: PerformanceReview[];
}

export default function DashboardOverview({ 
  ratingsData, 
  userRole, 
  myReviews, 
  teamReviews 
}: DashboardOverviewProps) {
  const isMobile = useIsMobile();
  
  // Calculate review stats
  const totalReviews = userRole === 'employee' ? myReviews.length : teamReviews.length;
  const completedReviews = userRole === 'employee' 
    ? myReviews.filter(r => r.status === 'submitted' || r.status === 'acknowledged').length 
    : teamReviews.filter(r => r.status === 'submitted' || r.status === 'acknowledged').length;
  
  const inProgressReviews = userRole === 'employee' 
    ? myReviews.filter(r => r.status === 'in_progress').length 
    : teamReviews.filter(r => r.status === 'in_progress').length;
  
  const notStartedReviews = userRole === 'employee' 
    ? myReviews.filter(r => r.status === 'not_started').length 
    : teamReviews.filter(r => r.status === 'not_started').length;

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-1 lg:grid-cols-7">
      <Card className="col-span-full lg:col-span-4 shadow-md border border-purple-100 dark:border-purple-900/30 hover:shadow-lg transition-shadow">
        <CardHeader className={isMobile ? 'p-4' : ''}>
          <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Performance Ratings</CardTitle>
          <CardDescription className="text-gray-500">Average ratings across all review parameters</CardDescription>
        </CardHeader>
        <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
          <RatingsGraph 
            data={ratingsData} 
            title="Performance Ratings" 
            description="Average ratings across all review parameters"
          />
        </CardContent>
      </Card>
      
      <Card className="col-span-full lg:col-span-3 shadow-md border border-blue-100 dark:border-blue-900/30 hover:shadow-lg transition-shadow">
        <CardHeader className={isMobile ? 'p-4' : ''}>
          <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Review Progress</CardTitle>
          <CardDescription className="text-gray-500">Current review cycle completion status</CardDescription>
        </CardHeader>
        <CardContent className={isMobile ? 'p-4 pt-0' : ''}>
          <ReviewProgress
            totalReviews={totalReviews}
            completedReviews={completedReviews}
            inProgressReviews={inProgressReviews}
            notStartedReviews={notStartedReviews}
          />
        </CardContent>
      </Card>
    </div>
  );
}
