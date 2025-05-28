import { useState } from "react";
import { Goal } from "@/types";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import GoalListHeader from "../goals/GoalListHeader";
import GoalTableWrapper from "../goals/GoalTableWrapper";
import { useEnhancedGoalsData } from "@/hooks/useEnhancedGoalsData";
import { useToast } from "@/hooks/use-toast";

interface PerformanceGoalsTabProps { 
  goals?: Goal[];
  onAddGoal?: (goal: Goal) => void;
  onUpdateGoal?: (goal: Goal) => void;
  onDeleteGoal?: (goalId: string) => void;
}

export default function PerformanceGoalsTab({ 
  goals: propGoals, 
  onAddGoal, 
  onUpdateGoal, 
  onDeleteGoal 
}: PerformanceGoalsTabProps) {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  
  // Use enhanced goals data if no goals are passed as props
  const { 
    goals: enhancedGoals, 
    isLoading: enhancedLoading, 
    error: enhancedError,
    createGoal,
    updateGoal,
    deleteGoal
  } = useEnhancedGoalsData();
  
  const goals = propGoals || enhancedGoals;
  const isLoading = propGoals ? false : enhancedLoading;
  const error = propGoals ? null : enhancedError;
  
  const canEdit = user?.role === 'admin' || user?.role === 'manager';

  const handleUpdateStatus = async (goalId: string, status: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      const updatedGoal = {
        ...goal,
        status: status as "not_started" | "in_progress" | "completed",
        progress: status === "completed" ? 100 : goal.progress,
      };
      
      try {
        if (onUpdateGoal) {
          onUpdateGoal(updatedGoal);
        } else {
          await updateGoal(goalId, updatedGoal);
          toast({
            title: "Goal updated",
            description: "Goal status has been updated successfully.",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to update goal status.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdateProgress = async (goalId: string, progress: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      const updatedGoal = {
        ...goal,
        progress,
        status: progress === 100 ? "completed" as const : goal.status,
      };
      
      try {
        if (onUpdateGoal) {
          onUpdateGoal(updatedGoal);
        } else {
          await updateGoal(goalId, updatedGoal);
          toast({
            title: "Goal updated",
            description: "Goal progress has been updated successfully.",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to update goal progress.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDelete = async (goalId: string) => {
    try {
      if (onDeleteGoal) {
        onDeleteGoal(goalId);
      } else {
        await deleteGoal(goalId);
        toast({
          title: "Goal deleted",
          description: "The goal has been removed successfully.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete goal.",
        variant: "destructive",
      });
    }
  };

  // Create a wrapper function to handle the update goal signature mismatch
  const handleEditGoal = async (goal: Goal) => {
    try {
      if (onUpdateGoal) {
        onUpdateGoal(goal);
      } else {
        await updateGoal(goal.id, goal);
        toast({
          title: "Goal updated",
          description: "Goal has been updated successfully.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update goal.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-muted-foreground">Loading goals...</div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-destructive">Error loading goals: {error}</div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <GoalListHeader canEdit={canEdit} />
      
      <GoalTableWrapper 
        goals={goals}
        onEditGoal={handleEditGoal}
        onDeleteGoal={handleDelete}
        onUpdateStatus={handleUpdateStatus}
        onUpdateProgress={handleUpdateProgress}
        canEdit={canEdit}
      />
    </Card>
  );
}
