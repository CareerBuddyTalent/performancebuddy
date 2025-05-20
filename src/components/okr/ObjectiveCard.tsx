
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Objective } from "@/services/objectiveService";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, Circle, AlertCircle, Clock, Zap, Ban } from "lucide-react";
import { OKRProgressBar } from "./OKRProgressBar";

interface ObjectiveCardProps {
  objective: Objective;
  onView?: () => void;
}

export default function ObjectiveCard({ objective, onView }: ObjectiveCardProps) {
  const statusIcons = {
    not_started: <Clock className="h-4 w-4 text-gray-400" />,
    in_progress: <Circle className="h-4 w-4 text-blue-500" />,
    behind_schedule: <AlertCircle className="h-4 w-4 text-red-500" />,
    on_track: <Circle className="h-4 w-4 text-green-500" />,
    ahead: <Zap className="h-4 w-4 text-purple-500" />,
    completed: <CheckCircle className="h-4 w-4 text-green-500" />,
    canceled: <Ban className="h-4 w-4 text-gray-500" />
  };

  const statusColors = {
    not_started: "bg-gray-200 text-gray-700",
    in_progress: "bg-blue-100 text-blue-800",
    behind_schedule: "bg-red-100 text-red-800",
    on_track: "bg-green-100 text-green-800",
    ahead: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    canceled: "bg-gray-100 text-gray-800"
  };

  const formatStatus = (status: string) => {
    return status.split("_").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  const daysLeft = () => {
    const due = new Date(objective.due_date);
    if (due.getTime() < Date.now()) {
      return "Overdue";
    }
    return formatDistanceToNow(due, { addSuffix: true });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className={statusColors[objective.status as keyof typeof statusColors]}>
            <span className="flex items-center gap-1">
              {statusIcons[objective.status as keyof typeof statusIcons]}
              {formatStatus(objective.status)}
            </span>
          </Badge>
          <Badge variant="secondary">{objective.level}</Badge>
        </div>
        <CardTitle className="truncate">{objective.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {objective.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{objective.progress}%</span>
            </div>
            <OKRProgressBar 
              value={objective.progress} 
              status={objective.status}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Due Date</p>
              <p>{new Date(objective.due_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Timeline</p>
              <p>{daysLeft()}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Key Results</p>
              <p>{objective.key_results ? objective.key_results.length : 0} key results</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onView}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
