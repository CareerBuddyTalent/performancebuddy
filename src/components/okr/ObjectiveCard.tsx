import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2, CheckCircle, Circle, ArrowRight, CheckCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KeyResultItem } from "./KeyResultItem";
import { Objective } from "@/services/objectiveService";

interface ObjectiveCardProps {
  objective: Objective;
  onViewDetails?: () => void;
  onAddKeyResult?: () => void;
  onCheckIn?: () => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
  showActions?: boolean;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  onViewDetails,
  onAddKeyResult,
  onCheckIn,
  expanded = false,
  onToggleExpand,
  showActions = true,
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "on_track":
        return "outline";
      case "behind_schedule":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) {
      return 'bg-green-600';
    } else if (progress >= 50) {
      return 'bg-amber-600';
    } else {
      return 'bg-red-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderKeyResults = (keyResults: any[]) => {
    if (!keyResults || keyResults.length === 0) {
      return (
        <div className="text-sm text-muted-foreground p-2">
          No key results added yet.
        </div>
      );
    }

    return keyResults.map((kr) => (
      <KeyResultItem
        key={kr.id}
        keyResult={{
          id: kr.id,
          objectiveId: kr.objective_id,
          title: kr.title,
          description: kr.description || '',
          currentValue: kr.current_value,
          targetValue: kr.target_value,
          startValue: kr.start_value,
          type: 'number',
          unit: kr.unit || '',
          progress: kr.progress,
          dueDate: new Date(kr.due_date),
          status: kr.status,
          lastCheckin: kr.last_checkin ? new Date(kr.last_checkin) : undefined
        }}
        onCheckIn={() => {}}
      />
    ));
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold">{objective.title}</h3>
              {showActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={onViewDetails}>
                      <Edit className="h-4 w-4 mr-2" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onAddKeyResult}>
                      <Plus className="h-4 w-4 mr-2" /> Add Key Result
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{objective.description || 'No description'}</p>
            <div className="flex items-center space-x-2">
              <Badge variant={getStatusBadgeVariant(objective.status)}>
                {objective.status?.replace(/_/g, ' ')}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Start: {formatDate(objective.start_date)}
              </span>
              <span className="text-xs text-muted-foreground">
                Due: {formatDate(objective.due_date)}
              </span>
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Progress</span>
                <span className="text-xs font-medium">{objective.progress}%</span>
              </div>
              <Progress value={objective.progress} className={`h-2 ${getProgressColor(objective.progress)}`} />
            </div>
          </div>
        </div>
        
        {expanded && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Key Results</h4>
            {renderKeyResults(objective.key_results || [])}
            {showActions && (
              <Button variant="secondary" size="sm" className="mt-2 w-full" onClick={onCheckIn}>
                Check-in <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
