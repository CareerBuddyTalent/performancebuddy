
import { useState } from "react";
import { Goal } from "@/types";
import { ChevronDown, Edit, Trash, Target, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

interface PerformanceGoalTableProps {
  goals: Goal[];
  onEditGoal?: (goal: Goal) => void;
  onDeleteGoal?: (goalId: string) => void;
  onUpdateStatus?: (goalId: string, status: string) => void;
  onUpdateProgress?: (goalId: string, progress: number) => void;
}

export default function PerformanceGoalTable({ 
  goals, 
  onEditGoal, 
  onDeleteGoal,
  onUpdateStatus,
  onUpdateProgress
}: PerformanceGoalTableProps) {
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'manager';

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Goal</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Level</TableHead>
            {canEdit && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {goals.length > 0 ? (
            goals.map((goal) => (
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
                    <Progress 
                      value={goal.progress} 
                      className="h-2"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  {canEdit ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2">
                          <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'}>
                            {goal.status.replace('_', ' ')}
                          </Badge>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onUpdateStatus?.(goal.id, "not_started")}>
                          Not Started
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdateStatus?.(goal.id, "in_progress")}>
                          In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdateStatus?.(goal.id, "completed")}>
                          Completed
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'}>
                      {goal.status.replace('_', ' ')}
                    </Badge>
                  )}
                </TableCell>
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
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={canEdit ? 6 : 5} className="text-center py-8">
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No goals found. Add a goal to get started.</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
