
import RatingsGraph from "@/components/RatingsGraph";
import ReviewProgress from "@/components/ReviewProgress";
import { PerformanceReview } from "@/types";

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
          totalReviews={totalReviews}
          completedReviews={completedReviews}
          inProgressReviews={inProgressReviews}
          notStartedReviews={notStartedReviews}
        />
      </div>
    </div>
  );
}
