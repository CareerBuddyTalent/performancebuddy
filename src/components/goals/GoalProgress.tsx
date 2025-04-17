
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Circle, CheckCircle2 } from "lucide-react";

interface GoalProgressProps {
  totalGoals: number;
  completedGoals: number;
  inProgressGoals: number;
}

export default function GoalProgress({
  totalGoals,
  completedGoals,
  inProgressGoals
}: GoalProgressProps) {
  const notStartedGoals = totalGoals - completedGoals - inProgressGoals;
  const completionPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Target className="h-5 w-5 text-muted-foreground" />
          Goal Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Completion</span>
              <span className="font-medium">{Math.round(completionPercentage)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="flex flex-col items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle2 className="h-5 w-5 mb-1 text-green-600 dark:text-green-400" />
              <span className="text-xl font-bold text-green-600 dark:text-green-400">{completedGoals}</span>
              <span className="text-xs text-muted-foreground">Completed</span>
            </div>
            
            <div className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Circle className="h-5 w-5 mb-1 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{inProgressGoals}</span>
              <span className="text-xs text-muted-foreground">In Progress</span>
            </div>
            
            <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
              <Target className="h-5 w-5 mb-1 text-gray-600 dark:text-gray-400" />
              <span className="text-xl font-bold text-gray-600 dark:text-gray-400">{notStartedGoals}</span>
              <span className="text-xs text-muted-foreground">Not Started</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
