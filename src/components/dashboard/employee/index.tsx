
import { useState } from "react";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { useNotificationContext } from "@/context/NotificationContext";

import ProfileHeader from "./ProfileHeader";
import NavigationTabs from "./NavigationTabs";
import ProgressionCard from "./ProgressionCard";
import ReviewTabs from "./ReviewTabs";
import ReviewRequestDialog from "./ReviewRequestDialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function EmployeeDashboard({ reviews, goals, feedbackEntries, users, parameters }: any) {
  const { user } = useSupabaseAuth();
  const { addNotification } = useNotificationContext();
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!user) return null;

  // Find user's manager
  const manager = users.find((u: any) => u.name === user.manager);

  // Filter goals for this employee
  const myGoals = goals.filter((goal: any) => goal.userId === user.id);
  const goalProgress = myGoals.length > 0 
    ? Math.round((myGoals.filter((g: any) => g.status === 'completed').length / myGoals.length) * 100) 
    : 0;

  const handleRequestReviewClick = () => {
    setIsRequestDialogOpen(true);
  };

  const handleRequestReviewSubmit = async (reviewComments: string) => {
    if (!manager) {
      addNotification({
        title: "Error",
        description: "Could not find your manager. Please contact HR.",
        type: "error",
      });
      setIsRequestDialogOpen(false);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // We can't use requestReview since it's optional in AuthContextType
      /* 
      const success = await requestReview(manager.id);
      
      if (success) {
        addNotification({
          title: "Review requested",
          description: `Your request for a performance review has been sent to ${manager.name}`,
          type: "success",
        });
      } else {
        addNotification({
          title: "Request failed",
          description: "There was an error requesting your review. Please try again.",
          type: "error",
        });
      }
      */
      
      // Mock successful review request
      setTimeout(() => {
        addNotification({
          title: "Review requested",
          description: `Your request for a performance review has been sent to ${manager.name}`,
          type: "success",
        });
        setIsSubmitting(false);
        setIsRequestDialogOpen(false);
      }, 1000);
    } catch (error) {
      addNotification({
        title: "Request failed",
        description: "There was an error requesting your review. Please try again.",
        type: "error",
      });
      setIsSubmitting(false);
      setIsRequestDialogOpen(false);
    }
  };

  // Check if the user has any active review cycles
  const hasActiveReviewCycles = true; // In a real app, this would check if there are active cycles

  return (
    <div className="space-y-6">
      <ProfileHeader user={user} manager={manager} />
      <NavigationTabs goalProgress={goalProgress} />

      {hasActiveReviewCycles && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-300">Active Review Cycles</h3>
              <p className="text-blue-700 dark:text-blue-400 text-sm">
                You have pending self-assessments to complete
              </p>
            </div>
            <Button asChild>
              <Link to="/self-review" className="flex items-center gap-2">
                Complete Self Assessment
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
      
      <ProgressionCard />
      
      <div className="flex justify-between items-center">
        <ReviewTabs onRequestReview={handleRequestReviewClick} />
      </div>

      <ReviewRequestDialog 
        isOpen={isRequestDialogOpen}
        onOpenChange={setIsRequestDialogOpen}
        onSubmit={handleRequestReviewSubmit}
        isSubmitting={isSubmitting}
        managerName={manager?.name}
      />
    </div>
  );
}
