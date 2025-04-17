
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ReviewRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (comments: string) => Promise<void>;
  isSubmitting: boolean;
  managerName?: string;
}

export default function ReviewRequestDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isSubmitting,
  managerName,
}: ReviewRequestDialogProps) {
  const [reviewComments, setReviewComments] = useState("");

  const handleSubmit = async () => {
    await onSubmit(reviewComments);
    setReviewComments("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Performance Review</DialogTitle>
          <DialogDescription>
            This will send a review request to your manager{managerName ? ` (${managerName})` : ""}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="comments" className="text-sm font-medium">Additional Comments (Optional)</label>
              <Textarea
                id="comments"
                placeholder="Add any context or specific areas you'd like feedback on"
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
