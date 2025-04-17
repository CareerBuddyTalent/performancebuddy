
import { Goal } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GoalTableRow } from "./table/GoalTableRow";
import { EmptyGoalState } from "./table/EmptyGoalState";

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
              <GoalTableRow
                key={goal.id}
                goal={goal}
                canEdit={canEdit}
                onEditGoal={onEditGoal}
                onDeleteGoal={onDeleteGoal}
                onUpdateStatus={onUpdateStatus}
                onUpdateProgress={onUpdateProgress}
              />
            ))
          ) : (
            <EmptyGoalState colSpan={canEdit ? 6 : 5} />
          )}
        </TableBody>
      </Table>
    </div>
  );
}
