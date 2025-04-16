
import { Goal } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, CircleDashed, Link as LinkIcon, User } from "lucide-react";
import { format } from "date-fns";

interface GoalCardProps {
  goal: Goal;
  onClick?: () => void;
  userName?: string;
  department?: string;
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

const levelColors = {
  individual: "bg-sky-100 text-sky-700",
  team: "bg-indigo-100 text-indigo-700",
  department: "bg-purple-100 text-purple-700",
  company: "bg-rose-100 text-rose-700"
};

export default function GoalCard({ goal, onClick, userName, department }: GoalCardProps) {
  const daysUntilDue = Math.ceil((goal.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const isDueSoon = daysUntilDue <= 7 && daysUntilDue > 0;
  const isOverdue = daysUntilDue < 0;
  
  return (
    <Card className="h-full cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg line-clamp-1">{goal.title}</CardTitle>
          <div className="flex-shrink-0">
            {statusIcons[goal.status]}
          </div>
        </div>
        {goal.level && (
          <div className="mt-1 flex flex-wrap gap-2">
            <Badge variant="outline" className={levelColors[goal.level] || ""}>
              {goal.level.charAt(0).toUpperCase() + goal.level.slice(1)}
            </Badge>
            {goal.level === "individual" && userName && (
              <Badge variant="outline" className="bg-slate-100 text-slate-700 flex items-center gap-1">
                <User className="h-3 w-3" />
                {userName}
              </Badge>
            )}
          </div>
        )}
        {department && goal.level === "individual" && (
          <div className="mt-1">
            <span className="text-xs text-muted-foreground">{department} Department</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{goal.description}</p>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Progress</span>
            <span className="font-bold">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>
        
        {/* Show integrations if available */}
        {goal.integrations && goal.integrations.length > 0 && (
          <div className="flex gap-2 mt-3">
            {goal.integrations.map((integration, idx) => (
              <Badge variant="outline" key={idx} className="flex items-center gap-1 text-xs">
                <LinkIcon className="h-3 w-3" />
                {integration.type}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Show milestone count if available */}
        {goal.milestones && goal.milestones.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            {goal.milestones.filter(m => m.status === 'completed').length} of {goal.milestones.length} milestones completed
          </div>
        )}
        
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
