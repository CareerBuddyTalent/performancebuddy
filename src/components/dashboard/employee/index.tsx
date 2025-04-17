
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotificationContext } from "@/context/NotificationContext";

import ProfileHeader from "./ProfileHeader";
import NavigationTabs from "./NavigationTabs";
import ProgressionCard from "./ProgressionCard";
import ReviewTabs from "./ReviewTabs";
import ReviewRequestDialog from "./ReviewRequestDialog";

export default function EmployeeDashboard({ reviews, goals, feedbackEntries, users, parameters }: any) {
  const { user, requestReview } = useAuth();
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
      const success = await requestReview(manager.id, reviewComments);
      
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
    } catch (error) {
      addNotification({
        title: "Request failed",
        description: "There was an error requesting your review. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
      setIsRequestDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <ProfileHeader user={user} manager={manager} />
      <NavigationTabs goalProgress={goalProgress} />
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
