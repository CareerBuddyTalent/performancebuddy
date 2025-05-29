
import { User, Goal, Skill, Review } from "@/types";
import UserProfile from "@/components/users/UserProfile";
import UserDetailTabs from "@/components/users/UserDetailTabs";

interface UserDetailContentProps {
  user: User;
  userGoals: Goal[];
  userSkills: Skill[];
  userReviews: Review[];
  averageRating: number;
  getPerformanceColor: (rating: number) => string;
}

export default function UserDetailContent({
  user,
  userGoals,
  userSkills,
  userReviews,
  averageRating,
  getPerformanceColor
}: UserDetailContentProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <UserProfile 
        user={user}
        averageRating={averageRating}
        userReviews={userReviews}
        userGoals={userGoals}
        userSkills={userSkills}
        getPerformanceColor={getPerformanceColor}
      />
      
      <UserDetailTabs
        user={user}
        userGoals={userGoals}
        userSkills={userSkills}
        userReviews={userReviews}
        getPerformanceColor={getPerformanceColor}
      />
    </div>
  );
}
