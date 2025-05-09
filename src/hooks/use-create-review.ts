
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
    if (performanceCycles.length > 0) {
      setCycleId(performanceCycles[0].id);
      setSelectedCycle(performanceCycles[0]);
    } else {
      setCycleId("");
      setSelectedCycle(null);
    }
    setInitialComments("");
  }, [performanceCycles]);

  // Update selected cycle when cycleId changes
  useEffect(() => {
    const cycle = cycles.find(c => c.id === cycleId);
    setSelectedCycle(cycle || null);
  }, [cycleId, cycles]);

  // Set activeTab and handle switching between individual and team reviews
  const handleTabChange = (tab: "individual" | "team") => {
    setActiveTab(tab);
    setSelectedEmployees([]); // Clear selected employees when switching tabs
  };

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
    
    if (!currentUser) {
      toast.error("You must be logged in to create a review");
      return;
    }
    
    let reviewsCreated = 0;
    
    selectedEmployees.forEach(employeeId => {
      // Create parameter ratings for each parameter in the selected cycle
      const ratings = selectedCycle.parameters.map(param => {
        const paramId = typeof param === 'string' ? param : param.id;
        return {
          parameterId: paramId,
          score: 0,
          comment: ""
        };
      });
      
      const newReview: PerformanceReview = {
        id: uuidv4(),
        employeeId,
        reviewerId: currentUser.id,
        cycleId,
        status: "not_started",
        ratings,
        overallRating: 0,
        feedback: initialComments,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      onCreateReview(newReview);
      reviewsCreated++;
    });

    const message = activeTab === "individual" 
      ? "Review created successfully" 
      : `${reviewsCreated} team reviews created successfully`;
    
    toast.success(message);
    onClose();
  };

  return {
    activeTab,
    setActiveTab: handleTabChange,
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
