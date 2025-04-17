
import { useState } from "react";
import { Goal } from "@/types";
import { Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import PerformanceGoalTable from "@/components/performance/PerformanceGoalTable";
import GoalFormDialog from "@/components/performance/GoalFormDialog";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  
  const canEdit = user?.role === 'admin' || user?.role === 'manager';

  const handleAddGoal = () => {
    setSelectedGoal(null);
    setIsDialogOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsDialogOpen(true);
  };

  const handleDeleteGoal = (goalId: string) => {
    if (onDeleteGoal) {
      onDeleteGoal(goalId);
      toast({
        title: "Goal deleted",
        description: "The goal has been removed successfully.",
      });
    }
  };

  const handleUpdateStatus = (goalId: string, status: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal && onUpdateGoal) {
      onUpdateGoal({
        ...goal,
        status: status as "not_started" | "in_progress" | "completed",
        progress: status === "completed" ? 100 : goal.progress,
      });
      
      toast({
        title: "Status updated",
        description: `Goal status has been updated to ${status.replace("_", " ")}.`,
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
      
      toast({
        title: "Progress updated",
        description: `Goal progress has been updated to ${progress}%.`,
      });
    }
  };

  const handleSaveGoal = (goal: Goal) => {
    if (selectedGoal) {
      // Update existing goal
      if (onUpdateGoal) {
        onUpdateGoal(goal);
        toast({
          title: "Goal updated",
          description: "The goal has been updated successfully.",
        });
      }
    } else {
      // Add new goal
      if (onAddGoal) {
        onAddGoal(goal);
        toast({
          title: "Goal created",
          description: "New goal has been created successfully.",
        });
      }
    }
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle>Performance Goals</CardTitle>
          <CardDescription>
            Track and manage goal progress for this quarter
          </CardDescription>
        </div>
        
        <div className="flex items-center gap-2">
          {canEdit && (
            <>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
              <Button size="sm" onClick={handleAddGoal}>
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <PerformanceGoalTable 
          goals={goals}
          onEditGoal={handleEditGoal}
          onDeleteGoal={handleDeleteGoal}
          onUpdateStatus={handleUpdateStatus}
          onUpdateProgress={handleUpdateProgress}
        />
      </CardContent>

      <GoalFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        goal={selectedGoal}
        onSave={handleSaveGoal}
      />
    </Card>
  );
}
