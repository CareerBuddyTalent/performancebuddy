
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import SelfReviewForm from "@/components/reviews/SelfReviewForm";
import ActiveReviewCycle from "@/components/reviews/ActiveReviewCycle";
import PastReviews from "@/components/reviews/PastReviews";
import ManagerFeedback from "@/components/reviews/ManagerFeedback";
import ReviewProgress from "@/components/ReviewProgress";
import GoalProgress from "@/components/goals/GoalProgress";
import { ReviewSkill } from "@/types";
import { initialSkills } from "@/data/reviewSkillsData";
import { 
  getActiveReviewCycles, 
  getReviewParameters, 
  getPastReviews 
} from "@/services/reviewService";

export default function Reviews() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [skills, setSkills] = useState<ReviewSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCycle, setActiveCycle] = useState<any>(null);
  const [pastReviews, setPastReviews] = useState<any[]>([]);
  const [parameters, setParameters] = useState<any[]>([]);

  // Load skills from mock data (replace with API call later)
  useEffect(() => {
    setSkills(initialSkills || []);
  }, []);

  // Load review cycles and data
  useEffect(() => {
    if (!user) return;

    const loadReviewData = async () => {
      try {
        setIsLoading(true);
        
        // Get active review cycles
        const cycles = await getActiveReviewCycles();
        
        if (cycles.length > 0) {
          const currentCycle = cycles[0]; // Use the most recent cycle
          setActiveCycle(currentCycle);
          
          // Load parameters for this cycle
          const cycleParams = await getReviewParameters(currentCycle.id);
          setParameters(cycleParams);
        }
        
        // Get past reviews
        const userPastReviews = await getPastReviews(user.id);
        setPastReviews(userPastReviews || []);
        
      } catch (error) {
        console.error("Error loading review data:", error);
        toast({
          title: "Error",
          description: "Failed to load review data. Please try again later."
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadReviewData();
  }, [user, toast]);

  const handleSubmitReview = async (data: any) => {
    // This is now handled inside the SelfReviewForm component
    toast({
      title: "Review submitted",
      description: "Your self review has been submitted successfully.",
    });
  };

  if (!user) return null;

  // Calculate review statistics for progress tracking
  const totalReviews = pastReviews.length + (activeCycle ? 1 : 0);
  const completedReviews = pastReviews.filter(review => review.status === "completed").length;
  const inProgressReviews = pastReviews.filter(review => review.status === "in_review").length;
  const notStartedReviews = totalReviews - completedReviews - inProgressReviews;

  // Get the latest review's feedback if it exists
  const latestReview = pastReviews[0];

  // Mock goal progress data (replace with real data later)
  const personalGoals = activeCycle?.personalGoals || [];
  const completedGoals = personalGoals.filter(goal => goal.status === "completed").length;
  const inProgressGoals = personalGoals.filter(goal => goal.status === "in_progress").length;
  const totalGoals = personalGoals.length;

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Reviews</h1>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Reviews</h1>
      
      <div className="grid gap-6 mb-6">
        <div className="grid gap-6 md:grid-cols-2">
          {activeCycle ? (
            <ActiveReviewCycle 
              name={activeCycle.name}
              deadline={activeCycle.end_date}
            />
          ) : (
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold">No Active Review Cycle</h3>
              <p className="text-muted-foreground">
                There are no active review cycles at the moment.
              </p>
            </div>
          )}
          
          <ReviewProgress
            totalReviews={totalReviews}
            completedReviews={completedReviews}
            inProgressReviews={inProgressReviews}
            notStartedReviews={notStartedReviews}
          />
        </div>

        <GoalProgress
          totalGoals={totalGoals}
          completedGoals={completedGoals}
          inProgressGoals={inProgressGoals}
        />
      </div>
      
      {latestReview && (
        <ManagerFeedback
          feedback={latestReview.feedback || ""}
          dateSubmitted={latestReview.submitted_at}
          status={latestReview.status}
        />
      )}
      
      {activeCycle && (
        <SelfReviewForm 
          cycleId={activeCycle.id}
          parameters={parameters}
          skills={skills}
          onSubmit={handleSubmitReview}
        />
      )}

      <PastReviews reviews={pastReviews} />
    </div>
  );
}
