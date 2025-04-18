
import { Goal } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import PerformanceGoalTable from "../PerformanceGoalTable";

interface GoalTableWrapperProps {
  goals: Goal[];
  onEditGoal?: (goal: Goal) => void;
  onDeleteGoal?: (goalId: string) => void;
  onUpdateStatus?: (goalId: string, status: string) => void;
  onUpdateProgress?: (goalId: string, progress: number) => void;
  canEdit: boolean;
}

export default function GoalTableWrapper({
  goals,
  onEditGoal,
  onDeleteGoal,
  onUpdateStatus,
  onUpdateProgress,
  canEdit,
}: GoalTableWrapperProps) {
  return (
    <CardContent>
      <PerformanceGoalTable 
        goals={goals}
        onEditGoal={onEditGoal}
        onDeleteGoal={onDeleteGoal}
        onUpdateStatus={onUpdateStatus}
        onUpdateProgress={onUpdateProgress}
      />
    </CardContent>
  );
}
