
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, ReviewCycle, PerformanceReview } from "@/types";
import { users as mockUsers } from "@/data/mockData";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
import ReviewTypeSelector from "./reviews/ReviewTypeSelector";
import CycleSelector from "./reviews/CycleSelector";
import EmployeeSelector from "./reviews/EmployeeSelector";
import InitialComments from "./reviews/InitialComments";

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
  const [activeTab, setActiveTab] = useState<"individual" | "team">("individual");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [cycleId, setCycleId] = useState("");
  const [initialComments, setInitialComments] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<ReviewCycle | null>(null);
  
  // Filter available cycles to only performance review cycles
  const performanceCycles = cycles.filter(cycle => 
    cycle.purpose === "performance" || !cycle.purpose
  );
  
  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setActiveTab("individual");
      setSelectedEmployees([]);
      setCycleId(performanceCycles.length > 0 ? performanceCycles[0].id : "");
      setInitialComments("");
      setSelectedCycle(performanceCycles.length > 0 ? performanceCycles[0] : null);
    }
  }, [open, performanceCycles]);
  
  // Filter users based on current user role
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "manager") {
        setFilteredUsers(
          mockUsers.filter(u => u.manager === currentUser.name && u.role === "employee")
        );
      } else if (currentUser.role === "admin") {
        setFilteredUsers(mockUsers.filter(u => u.role === "employee"));
      }
    }
  }, [currentUser]);
  
  // Update selected cycle when cycleId changes
  useEffect(() => {
    const cycle = cycles.find(c => c.id === cycleId);
    setSelectedCycle(cycle || null);
  }, [cycleId, cycles]);
  
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    
    if (!cycleId || !selectedCycle) {
      toast.error("Please select a review cycle");
      return;
    }

    if (activeTab === "individual" && selectedEmployees.length !== 1) {
      toast.error("Please select an employee for individual review");
      return;
    }

    if (activeTab === "team" && selectedEmployees.length === 0) {
      toast.error("Please select at least one team member");
      return;
    }
    
    // Create reviews for all selected employees
    selectedEmployees.forEach(employeeId => {
      const ratings = selectedCycle.parameters.map(param => ({
        parameterId: typeof param === 'string' ? param : param.id,
        score: 0,
        comment: ""
      }));
      
      const newReview: PerformanceReview = {
        id: uuidv4(),
        employeeId,
        reviewerId: currentUser?.id || "",
        cycleId,
        status: "not_started",
        ratings,
        overallRating: 0,
        feedback: initialComments,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      onCreateReview(newReview);
    });

    const message = activeTab === "individual" 
      ? "Review created successfully" 
      : `${selectedEmployees.length} team reviews created successfully`;
    
    toast.success(message);
    onOpenChange(false);
  };
  
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
