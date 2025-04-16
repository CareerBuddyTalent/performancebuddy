
import { Goal } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle2, CircleDashed } from "lucide-react";
import { format } from "date-fns";

interface GoalCardProps {
  goal: Goal;
}

const statusIcons = {
  not_started: <CircleDashed className="h-5 w-5 text-slate-500" />,
  in_progress: <Clock className="h-5 w-5 text-amber-500" />,
  completed: <CheckCircle2 className="h-5 w-5 text-green-500" />
};

const statusLabels = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed"
};

export default function GoalCard({ goal }: GoalCardProps) {
  const daysUntilDue = Math.ceil((goal.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const isDueSoon = daysUntilDue <= 7 && daysUntilDue > 0;
  const isOverdue = daysUntilDue < 0;
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{goal.title}</CardTitle>
          {statusIcons[goal.status]}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-4">{goal.description}</p>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Progress</span>
            <span className="font-bold">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>
        
        {goal.alignedWith && (
          <div className="mt-4">
            <span className="text-xs text-muted-foreground block mb-1">Aligned with:</span>
            <span className="text-sm">{goal.alignedWith}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-1 text-xs text-muted-foreground">
        <div className="flex items-center">
          <span className="font-medium mr-1">Status:</span>
          <span>{statusLabels[goal.status]}</span>
        </div>
        <div className={`flex items-center ${isDueSoon ? 'text-amber-500' : ''} ${isOverdue ? 'text-red-500' : ''}`}>
          <span className="font-medium mr-1">Due:</span>
          <span>
            {format(goal.dueDate, 'MMM d, yyyy')}
            {isDueSoon && " (Soon)"}
            {isOverdue && " (Overdue)"}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
