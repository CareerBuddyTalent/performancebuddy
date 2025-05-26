import { useState } from "react";
import { Goal } from "@/types";
import { useClerkAuth } from "@/context/ClerkAuthContext";
import { toast } from "@/hooks/use-toast";
import { hasPermission } from "@/types/performance-permissions";
import PerformanceHeader from "./dashboard/PerformanceHeader";
import PerformanceStats from "./dashboard/PerformanceStats";
import PerformanceTabs from "./PerformanceTabs";
import GoalManagement from "./dashboard/GoalManagement";
import { useEnhancedGoalsData } from "@/hooks/useEnhancedGoalsData";

export default function PerformanceDashboard() {
  const { user } = useClerkAuth();
  const [activeTab, setActiveTab] = useState("goals");
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('quarter');
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);

  // Use real goals data instead of mock data
  const {
    goals: performanceGoals,
    isLoading: goalsLoading,
    error: goalsError,
    createGoal,
    updateGoal,
    deleteGoal
  } = useEnhancedGoalsData();

  if (!user) return null;

  const canManageGoals = hasPermission(user.role, 'manage_team_goals');
  const canViewAllGoals = hasPermission(user.role, 'view_all_goals');
  const canManageSettings = hasPermission(user.role, 'manage_settings');
  const canViewAnalytics = hasPermission(user.role, 'view_analytics');

  // Filter goals based on permissions
  const filteredGoals = canViewAllGoals 
    ? performanceGoals 
    : performanceGoals.filter(goal => goal.userId === user.id);

  const handleAddGoal = () => {
    setIsAddGoalOpen(true);
  };

  const handleExport = (format: string) => {
    toast({
      title: `Exporting ${timeframe}ly report`,
      description: `Your ${timeframe}ly performance report is being generated as ${format.toUpperCase()}`,
    });
  };

  const handleAddGoalSubmit = async (goalData: Omit<Goal, "id" | "createdAt" | "updatedAt">) => {
    if (canManageGoals) {
      try {
        await createGoal(goalData);
        
        toast({
          title: "Goal created",
          description: "New goal has been created successfully.",
        });
        setIsAddGoalOpen(false);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to create goal. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdateGoal = async (updatedGoal: Goal) => {
    try {
      await updateGoal(updatedGoal.id, updatedGoal);
      toast({
        title: "Goal updated",
        description: "Goal has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await deleteGoal(goalId);
      toast({
        title: "Goal deleted",
        description: "The goal has been removed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (goalsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-muted-foreground">Loading performance data...</div>
        </div>
      </div>
    );
  }

  if (goalsError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-destructive">Error loading performance data: {goalsError}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PerformanceHeader 
        onAddGoal={canManageGoals ? handleAddGoal : undefined} 
      />
      <PerformanceStats performanceGoals={filteredGoals} />
      
      <PerformanceTabs 
        canManageSettings={canManageSettings}
        canViewAnalytics={canViewAnalytics}
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        performanceGoals={filteredGoals} 
        timeframe={timeframe}
        handleExport={handleExport}
        onAddGoal={canManageGoals ? handleAddGoalSubmit : undefined}
        onUpdateGoal={canManageGoals ? handleUpdateGoal : undefined}
        onDeleteGoal={canManageGoals ? handleDeleteGoal : undefined}
      />

      {canManageGoals && (
        <GoalManagement
          onAddGoal={handleAddGoalSubmit}
          onUpdateGoal={handleUpdateGoal}
          isAddGoalOpen={isAddGoalOpen}
          setIsAddGoalOpen={setIsAddGoalOpen}
        />
      )}
    </div>
  );
}
