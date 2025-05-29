
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUserDetailData } from "@/hooks/useUserDetailData";
import UserDetailHeader from "@/components/users/UserDetailHeader";
import UserDetailContent from "@/components/users/UserDetailContent";

export default function UserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const {
    user,
    userGoals,
    userSkills,
    userReviews,
    averageRating,
    getPerformanceColor
  } = useUserDetailData(userId);
  
  if (!user) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold">User not found</h1>
        <p className="mt-4">The requested user does not exist or you don't have permission to view it.</p>
        <Button asChild className="mt-6">
          <Link to="/users">Back to User Management</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <UserDetailHeader />
      
      <UserDetailContent
        user={user}
        userGoals={userGoals}
        userSkills={userSkills}
        userReviews={userReviews}
        averageRating={averageRating}
        getPerformanceColor={getPerformanceColor}
      />
    </div>
  );
}
