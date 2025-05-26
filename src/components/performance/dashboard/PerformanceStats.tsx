
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Trophy, Users } from "lucide-react";
import { Goal } from "@/types";

interface PerformanceStatsProps {
  performanceGoals: Goal[];
}

export default function PerformanceStats({ performanceGoals }: PerformanceStatsProps) {
  const totalGoals = performanceGoals.length;
  const completedGoals = performanceGoals.filter(goal => goal.status === "completed").length;
  const inProgressGoals = performanceGoals.filter(goal => goal.status === "in_progress").length;
  const notStartedGoals = performanceGoals.filter(goal => goal.status === "not_started").length;
  
  const averageProgress = totalGoals > 0 
    ? Math.round(performanceGoals.reduce((sum, goal) => sum + goal.progress, 0) / totalGoals)
    : 0;
  
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
  
  // Calculate metrics from goal data
  const totalMetrics = performanceGoals.reduce((sum, goal) => {
    return sum + (Array.isArray(goal.metrics) ? goal.metrics.length : 0);
  }, 0);
  
  const totalMilestones = performanceGoals.reduce((sum, goal) => {
    return sum + (Array.isArray(goal.milestones) ? goal.milestones.length : 0);
  }, 0);
  
  const completedMilestones = performanceGoals.reduce((sum, goal) => {
    if (Array.isArray(goal.milestones)) {
      return sum + goal.milestones.filter(m => m.status === 'completed').length;
    }
    return sum;
  }, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalGoals}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {inProgressGoals} in progress, {notStartedGoals} not started
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate}%</div>
          <Progress value={completionRate} className="mt-2" />
          <div className="text-xs text-muted-foreground mt-1">
            {completedGoals} of {totalGoals} goals completed
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageProgress}%</div>
          <Progress value={averageProgress} className="mt-2" />
          <div className="text-xs text-muted-foreground mt-1">
            Across all active goals
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Milestones</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedMilestones}/{totalMilestones}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {totalMetrics} metrics tracked
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
