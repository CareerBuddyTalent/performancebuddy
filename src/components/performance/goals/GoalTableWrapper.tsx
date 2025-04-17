
import { Goal } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import PerformanceGoalTable from "../PerformanceGoalTable";
import GoalFormDialog from "../GoalFormDialog";
import GoalSettingsDialog from "../GoalSettingsDialog";
import { useState } from "react";

interface GoalTableWrapperProps {
  goals: Goal[];
  onEditGoal?: (goal: Goal) => void;
  onDeleteGoal?: (goalId: string) => void;
  onUpdateStatus?: (goalId: string, status: string) => void;
  onUpdateProgress?: (goalId: string, progress: number) => void;
  canEdit: boolean;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
}

export default function GoalTableWrapper({
  goals,
  onEditGoal,
  onDeleteGoal,
  onUpdateStatus,
  onUpdateProgress,
  canEdit,
  isSettingsOpen,
  setIsSettingsOpen
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

      <GoalSettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </CardContent>
  );
}
