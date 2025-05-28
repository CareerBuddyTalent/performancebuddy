
import React from 'react';
import { Goal } from "@/types";
import { LazyComponent } from '@/components/ui/lazy-component';
import { GoalTableRow } from './GoalTableRow';
import { TableRow, TableCell } from '@/components/ui/table';

interface LazyGoalTableRowProps {
  goal: Goal;
  canEdit: boolean;
  onEditGoal?: (goal: Goal) => void;
  onDeleteGoal?: (goalId: string) => void;
  onUpdateStatus?: (goalId: string, status: string) => void;
  onUpdateProgress?: (goalId: string, progress: number) => void;
}

export function LazyGoalTableRow(props: LazyGoalTableRowProps) {
  return (
    <LazyComponent 
      height="56px"
      fallback={
        <TableRow>
          <TableCell colSpan={props.canEdit ? 6 : 5}>
            <div className="animate-pulse bg-gray-200 h-4 rounded"></div>
          </TableCell>
        </TableRow>
      }
    >
      <GoalTableRow {...props} />
    </LazyComponent>
  );
}
