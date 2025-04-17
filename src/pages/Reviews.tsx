
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import SelfReviewForm from "@/components/reviews/SelfReviewForm";
import ActiveReviewCycle from "@/components/reviews/ActiveReviewCycle";
import PastReviews from "@/components/reviews/PastReviews";
import ManagerFeedback from "@/components/reviews/ManagerFeedback";
import { mockParameters, mockActiveCycle, mockPastReviews } from "@/components/reviews/mockReviewData";

export default function Reviews() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the latest review's feedback if it exists
  const latestReview = mockPastReviews[0];

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
      
      <ActiveReviewCycle 
        name={mockActiveCycle.name}
        deadline={mockActiveCycle.deadline}
      />
      
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
        onSubmit={handleSubmitReview}
      />

      <PastReviews reviews={mockPastReviews} />
    </div>
  );
}

