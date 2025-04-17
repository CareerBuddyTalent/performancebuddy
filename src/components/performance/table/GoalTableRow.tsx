
import { Goal } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Trash, Calendar, Target } from "lucide-react";
import { GoalStatusCell } from "./GoalStatusCell";

interface GoalTableRowProps {
  goal: Goal;
  canEdit: boolean;
  onEditGoal?: (goal: Goal) => void;
  onDeleteGoal?: (goalId: string) => void;
  onUpdateStatus?: (goalId: string, status: string) => void;
}

export function GoalTableRow({
  goal,
  canEdit,
  onEditGoal,
  onDeleteGoal,
  onUpdateStatus,
}: GoalTableRowProps) {
  return (
    <TableRow key={goal.id}>
      <TableCell className="font-medium">
        <div>
          <p className="font-semibold">{goal.title}</p>
          <p className="text-sm text-muted-foreground">{goal.description}</p>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          {new Date(goal.dueDate).toLocaleDateString()}
        </div>
      </TableCell>
      <TableCell>
        <div className="w-full max-w-xs">
          <div className="flex justify-between mb-1">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>
      </TableCell>
      <GoalStatusCell 
        status={goal.status} 
        canEdit={canEdit} 
        onUpdateStatus={(status) => onUpdateStatus?.(goal.id, status)} 
      />
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {goal.level}
        </Badge>
      </TableCell>
      {canEdit && (
        <TableCell className="text-right">
          <div className="flex items-center justify-end space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onEditGoal?.(goal)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDeleteGoal?.(goal.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}
