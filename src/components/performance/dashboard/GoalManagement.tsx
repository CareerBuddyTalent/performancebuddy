
import { useState } from "react";
import { Goal } from "@/types";
import GoalFormDialog from "../GoalFormDialog";
import { toast } from "@/hooks/use-toast";

interface GoalManagementProps {
  onAddGoal: (goal: Goal) => void;
  onUpdateGoal: (goal: Goal) => void;
  isAddGoalOpen: boolean;
  setIsAddGoalOpen: (open: boolean) => void;
}

export default function GoalManagement({ 
  onAddGoal, 
  onUpdateGoal, 
  isAddGoalOpen, 
  setIsAddGoalOpen 
}: GoalManagementProps) {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const handleAddGoalSubmit = (goal: Goal) => {
    if (selectedGoal) {
      onUpdateGoal(goal);
      toast({
        title: "Goal updated",
        description: "The goal has been updated successfully.",
      });
    } else {
      onAddGoal(goal);
      toast({
        title: "Goal created",
        description: "New goal has been created successfully.",
      });
    }
    setIsAddGoalOpen(false);
  };

  return (
    <GoalFormDialog
      open={isAddGoalOpen}
      onOpenChange={setIsAddGoalOpen}
      goal={selectedGoal}
      onSave={handleAddGoalSubmit}
    />
  );
}
