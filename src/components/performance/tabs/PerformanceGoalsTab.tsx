
import { useState } from "react";
import { Goal } from "@/types";
import { useClerkAuth } from "@/context/ClerkAuthContext";
import { Card } from "@/components/ui/card";
import GoalListHeader from "../goals/GoalListHeader";
import GoalTableWrapper from "../goals/GoalTableWrapper";

interface PerformanceGoalsTabProps { 
  goals: Goal[];
  onAddGoal?: (goal: Goal) => void;
  onUpdateGoal?: (goal: Goal) => void;
  onDeleteGoal?: (goalId: string) => void;
}

export default function PerformanceGoalsTab({ 
  goals, 
  onAddGoal, 
  onUpdateGoal, 
  onDeleteGoal 
}: PerformanceGoalsTabProps) {
  const { user } = useClerkAuth();
  
  const canEdit = user?.role === 'admin' || user?.role === 'manager';

  const handleUpdateStatus = (goalId: string, status: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal && onUpdateGoal) {
      onUpdateGoal({
        ...goal,
        status: status as "not_started" | "in_progress" | "completed",
        progress: status === "completed" ? 100 : goal.progress,
      });
    }
  };

  const handleUpdateProgress = (goalId: string, progress: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal && onUpdateGoal) {
      onUpdateGoal({
        ...goal,
        progress,
        status: progress === 100 ? "completed" : goal.status,
      });
    }
  };

  return (
    <Card>
      <GoalListHeader canEdit={canEdit} />
      
      <GoalTableWrapper 
        goals={goals}
        onEditGoal={onUpdateGoal}
        onDeleteGoal={onDeleteGoal}
        onUpdateStatus={handleUpdateStatus}
        onUpdateProgress={handleUpdateProgress}
        canEdit={canEdit}
      />
    </Card>
  );
}
