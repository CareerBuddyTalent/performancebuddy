
import { useState, useEffect } from "react";
import { ReviewCycle, PerformanceReview } from "@/types/performance";
import { User } from "@/types";
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
  const [selectedEmployees, setSelectedEmployees] = useState<User[]>([]);
  const [cycleId, setCycleId] = useState<string>("");
  const [initialComments, setInitialComments] = useState<string>("");
  const [templateId, setTemplateId] = useState<string>("");
  const [selectedCycle, setSelectedCycle] = useState<ReviewCycle | null>(null);
  const [performanceCycles, setPerformanceCycles] = useState<ReviewCycle[]>([]);

  useEffect(() => {
    // Filter available cycles to only performance review cycles
    const filteredCycles = cycles.filter(cycle => 
      cycle.purpose === "performance" || !cycle.purpose
    );
    setPerformanceCycles(filteredCycles);
  }, [cycles]);

  useEffect(() => {
    const cycle = performanceCycles.find(c => c.id === cycleId);
    setSelectedCycle(cycle || null);
  }, [cycleId, performanceCycles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cycleId || !currentUser) return;

    try {
      if (activeTab === "individual") {
        if (selectedEmployees.length !== 1) {
          toast.error("Please select an employee");
          return;
        }

        // Create individual review
        const employeeId = selectedEmployees[0].id;
        const review: PerformanceReview = {
          id: uuidv4(),
          employeeId,
          reviewerId: currentUser.id,
          cycleId,
          templateId,
          status: "not_started",
          ratings: [],
          overallRating: 0,
          feedback: initialComments || "",
          createdAt: new Date(),
          updatedAt: new Date()
        };

        onCreateReview(review);
        toast.success(`Review created for ${selectedEmployees[0].name}`);
      } else {
        // Team review - create multiple reviews
        if (selectedEmployees.length === 0) {
          toast.error("Please select at least one team member");
          return;
        }

        // Create a review for each selected employee
        const reviews: PerformanceReview[] = selectedEmployees.map(employee => ({
          id: uuidv4(),
          employeeId: employee.id,
          reviewerId: currentUser.id,
          cycleId,
          templateId,
          status: "not_started",
          ratings: [],
          overallRating: 0,
          feedback: initialComments || "",
          createdAt: new Date(),
          updatedAt: new Date()
        }));

        // Process each review - in a real scenario, we'd batch these
        reviews.forEach(review => {
          onCreateReview(review);
        });

        toast.success(`Created ${reviews.length} team reviews`);
      }

      // Reset form and close dialog
      onClose();
    } catch (err) {
      console.error("Error creating review:", err);
      toast.error("Failed to create review");
    }
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
    templateId,
    setTemplateId,
    selectedCycle,
    performanceCycles,
    handleSubmit
  };
}
