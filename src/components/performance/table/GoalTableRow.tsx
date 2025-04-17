
import { Goal } from "@/types";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { GoalStatusCell } from "./GoalStatusCell";
import { GoalProgressCell } from "./GoalProgressCell";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface GoalTableRowProps {
  goal: Goal;
  canEdit: boolean;
  onEditGoal?: (goal: Goal) => void;
  onDeleteGoal?: (goalId: string) => void;
  onUpdateStatus?: (goalId: string, status: string) => void;
  onUpdateProgress?: (goalId: string, progress: number) => void;
}

export function GoalTableRow({ 
  goal, 
  canEdit, 
  onEditGoal, 
  onDeleteGoal,
  onUpdateStatus,
  onUpdateProgress
}: GoalTableRowProps) {
  
  const handleUpdateStatus = (status: string) => {
    onUpdateStatus?.(goal.id, status);
  };
  
  const handleUpdateProgress = (progress: number) => {
    onUpdateProgress?.(goal.id, progress);
  };
  
  return (
    <TableRow key={goal.id}>
      <TableCell className="font-medium">
        <div>
          <div className="font-medium">{goal.title}</div>
          <div className="text-sm text-muted-foreground">{goal.description}</div>
        </div>
      </TableCell>
      <TableCell>
        {goal.dueDate ? format(new Date(goal.dueDate), 'MMM d, yyyy') : 'No due date'}
      </TableCell>
      
      <GoalProgressCell 
        progress={goal.progress} 
        canEdit={canEdit} 
        onUpdateProgress={handleUpdateProgress} 
      />
      
      <GoalStatusCell 
        status={goal.status} 
        canEdit={canEdit} 
        onUpdateStatus={handleUpdateStatus} 
      />
      
      <TableCell>
        <Badge variant="outline">{goal.level}</Badge>
      </TableCell>
      
      {canEdit && (
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditGoal?.(goal)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDeleteGoal?.(goal.id)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      )}
    </TableRow>
  );
}
