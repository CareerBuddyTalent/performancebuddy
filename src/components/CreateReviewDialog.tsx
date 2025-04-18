
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, ReviewCycle, PerformanceReview } from "@/types";
import ReviewForm from "./reviews/ReviewForm";

interface CreateReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateReview: (review: PerformanceReview) => void;
  cycles: ReviewCycle[];
  currentUser: User | null;
}

export default function CreateReviewDialog({
  open,
  onOpenChange,
  onCreateReview,
  cycles,
  currentUser
}: CreateReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Performance Review</DialogTitle>
          <DialogDescription>
            Create a new performance review for your team members
          </DialogDescription>
        </DialogHeader>
        
        <ReviewForm
          onCreateReview={onCreateReview}
          onClose={() => onOpenChange(false)}
          cycles={cycles}
          currentUser={currentUser}
        />
      </DialogContent>
    </Dialog>
  );
}
