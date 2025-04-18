
import { useState, useEffect } from "react";
import { User, ReviewCycle, PerformanceReview } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

interface UseCreateReviewProps {
  cycles: ReviewCycle[];
  currentUser: User | null;
  onCreateReview: (review: PerformanceReview) => void;
  onClose: () => void;
}

export function useCreateReview({ 
  cycles, 
  currentUser, 
  onCreateReview, 
  onClose 
}: UseCreateReviewProps) {
  const [activeTab, setActiveTab] = useState<"individual" | "team">("individual");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [cycleId, setCycleId] = useState("");
  const [initialComments, setInitialComments] = useState("");
  const [selectedCycle, setSelectedCycle] = useState<ReviewCycle | null>(null);

  // Filter available cycles to only performance review cycles
  const performanceCycles = cycles.filter(cycle => 
    cycle.purpose === "performance" || !cycle.purpose
  );

  // Reset form when dialog opens
  useEffect(() => {
    setActiveTab("individual");
    setSelectedEmployees([]);
    setCycleId(performanceCycles.length > 0 ? performanceCycles[0].id : "");
    setInitialComments("");
    setSelectedCycle(performanceCycles.length > 0 ? performanceCycles[0] : null);
  }, [performanceCycles]);

  // Update selected cycle when cycleId changes
  useEffect(() => {
    const cycle = cycles.find(c => c.id === cycleId);
    setSelectedCycle(cycle || null);
  }, [cycleId, cycles]);

  // When tab changes, reset selected employees
  useEffect(() => {
    setSelectedEmployees([]);
  }, [activeTab]);

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
    onClose();
  };

  return {
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
  };
}
