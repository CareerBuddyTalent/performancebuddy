
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, ReviewCycle, PerformanceReview } from "@/types";
import { users as mockUsers } from "@/data/mockData";
import ReviewTypeSelector from "./reviews/ReviewTypeSelector";
import CycleSelector from "./reviews/CycleSelector";
import EmployeeSelector from "./reviews/EmployeeSelector";
import InitialComments from "./reviews/InitialComments";
import { useCreateReview } from "@/hooks/use-create-review";

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
  const {
    activeTab,
    setActiveTab,
    selectedEmployees,
    setSelectedEmployees,
    cycleId,
    setCycleId,
    initialComments,
    setInitialComments,
    selectedCycle,
    performanceCycles,
    handleSubmit
  } = useCreateReview({ 
    cycles, 
    currentUser, 
    onCreateReview, 
    onClose: () => onOpenChange(false) 
  });
  
  // Filter users based on current user role
  const filteredUsers = currentUser ? 
    currentUser.role === "manager" 
      ? mockUsers.filter(u => u.manager === currentUser.name && u.role === "employee")
      : currentUser.role === "admin" 
        ? mockUsers.filter(u => u.role === "employee")
        : []
    : [];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Performance Review</DialogTitle>
            <DialogDescription>
              Create a new performance review for your team members
            </DialogDescription>
          </DialogHeader>
          
          <ReviewTypeSelector
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
            
          <div className="mt-4 space-y-4">
            <CycleSelector
              cycles={cycles}
              selectedCycleId={cycleId}
              onCycleChange={setCycleId}
            />

            <EmployeeSelector
              type={activeTab}
              employees={filteredUsers}
              selectedEmployees={selectedEmployees}
              onSelectionChange={setSelectedEmployees}
            />
            
            <InitialComments
              value={initialComments}
              onChange={setInitialComments}
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={
                !cycleId || 
                !selectedCycle || 
                (activeTab === "individual" && selectedEmployees.length !== 1) ||
                (activeTab === "team" && selectedEmployees.length === 0)
              }
            >
              Create {activeTab === "individual" ? "Review" : "Team Reviews"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
