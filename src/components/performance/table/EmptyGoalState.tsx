
import { TableCell, TableRow } from "@/components/ui/table";
import { Target } from "lucide-react";

interface EmptyGoalStateProps {
  colSpan: number;
}

export function EmptyGoalState({ colSpan }: EmptyGoalStateProps) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-8">
        <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No goals found. Add a goal to get started.</p>
      </TableCell>
    </TableRow>
  );
}
