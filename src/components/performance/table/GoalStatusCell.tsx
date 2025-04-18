
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface GoalStatusCellProps {
  status: string;
  canEdit: boolean;
  onUpdateStatus?: (status: string) => void;
}

export function GoalStatusCell({ status, canEdit, onUpdateStatus }: GoalStatusCellProps) {
  // Ensure status is a string to prevent the 'replace' error
  const safeStatus = status || 'not_started';
  const displayStatus = safeStatus.replace('_', ' ');
  
  return (
    <TableCell>
      {canEdit ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Badge variant={safeStatus === 'completed' ? 'default' : 'secondary'}>
                {displayStatus}
              </Badge>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onUpdateStatus?.("not_started")}>
              Not Started
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus?.("in_progress")}>
              In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUpdateStatus?.("completed")}>
              Completed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Badge variant={safeStatus === 'completed' ? 'default' : 'secondary'}>
          {displayStatus}
        </Badge>
      )}
    </TableCell>
  );
}
