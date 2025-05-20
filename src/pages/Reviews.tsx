import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import SelfReviewForm from "@/components/reviews/SelfReviewForm";
import ActiveReviewCycle from "@/components/reviews/ActiveReviewCycle";
import PastReviews from "@/components/reviews/PastReviews";
import ManagerFeedback from "@/components/reviews/ManagerFeedback";
import ReviewProgress from "@/components/ReviewProgress";
import GoalProgress from "@/components/goals/GoalProgress";
import { mockParameters, mockActiveCycle, mockPastReviews } from "@/components/reviews/mockReviewData";
import { initialSkills } from "@/data/reviewSkillsData";
import { ReviewSkill } from "@/types";

export default function Reviews() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skills, setSkills] = useState<ReviewSkill[]>([]);

  // In a real app, fetch skills from your backend
  useEffect(() => {
    // Simulating API call with mock data
    setSkills(initialSkills || []);
  }, []);

  // Get the latest review's feedback if it exists
  const latestReview = mockPastReviews[0];

  // Calculate review statistics for progress tracking
  const totalReviews = mockPastReviews.length + 1; // Including active review
  const completedReviews = mockPastReviews.filter(review => review.status === "completed").length;
  const inProgressReviews = mockPastReviews.filter(review => review.status === "in_progress").length;
  const notStartedReviews = totalReviews - completedReviews - inProgressReviews;

  // Calculate goal completion metrics
  const personalGoals = mockActiveCycle.personalGoals || [];
  const completedGoals = personalGoals.filter(goal => goal.status === "completed").length;
  const inProgressGoals = personalGoals.filter(goal => goal.status === "in_progress").length;
  const totalGoals = personalGoals.length;

  const handleSubmitReview = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Review submitted",
        description: "Your self review has been submitted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Reviews</h1>
      
      <div className="grid gap-6 mb-6">
        <div className="grid gap-6 md:grid-cols-2">
          <ActiveReviewCycle 
            name={mockActiveCycle.name}
            deadline={mockActiveCycle.deadline}
          />
          
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
          dateSubmitted={latestReview.submittedDate}
          status={latestReview.status}
        />
      )}
      
      <SelfReviewForm 
        cycleId={mockActiveCycle.id}
        parameters={mockParameters}
        skills={skills}
        onSubmit={handleSubmitReview}
      />

      <PastReviews reviews={mockPastReviews} />
    </div>
  );
}
