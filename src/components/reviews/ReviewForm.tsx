
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { User, ReviewCycle, PerformanceReview } from "@/types";
import { users as mockUsers } from "@/data/mockData";
import ReviewTypeSelector from "./ReviewTypeSelector";
import CycleSelector from "./CycleSelector";
import EmployeeSelector from "./EmployeeSelector";
import InitialComments from "./InitialComments";
import { useCreateReview } from "@/hooks/use-create-review";

interface ReviewFormProps {
  onCreateReview: (review: PerformanceReview) => void;
  onClose: () => void;
  cycles: ReviewCycle[];
  currentUser: User | null;
}

export default function ReviewForm({
  onCreateReview,
  onClose,
  cycles,
  currentUser
}: ReviewFormProps) {
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
    onClose
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
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 mt-4">
        <ReviewTypeSelector
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
          
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
        <Button variant="outline" type="button" onClick={onClose}>
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
  );
}
