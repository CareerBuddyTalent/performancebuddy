
import { useState } from "react";
import { Goal } from "@/types";
import { useAuth } from "@/context/AuthContext";
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
  const { user } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const canEdit = user?.role === 'admin' || user?.role === 'manager';

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

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
      <GoalListHeader 
        canEdit={canEdit}
        onAddGoal={undefined} // Remove the add goal functionality
        onOpenSettings={handleOpenSettings}
      />
      
      <GoalTableWrapper 
        goals={goals}
        onEditGoal={onUpdateGoal}
        onDeleteGoal={onDeleteGoal}
        onUpdateStatus={handleUpdateStatus}
        onUpdateProgress={handleUpdateProgress}
        canEdit={canEdit}
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
      />
    </Card>
  );
}
