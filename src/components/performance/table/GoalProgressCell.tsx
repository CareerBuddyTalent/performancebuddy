
import { TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

interface GoalProgressCellProps {
  progress: number;
  canEdit: boolean;
  onUpdateProgress?: (progress: number) => void;
}

export function GoalProgressCell({ progress, canEdit, onUpdateProgress }: GoalProgressCellProps) {
  return (
    <TableCell>
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        {canEdit ? (
          <Slider
            defaultValue={[progress]}
            max={100}
            step={5}
            className="w-full"
            onValueChange={(value) => onUpdateProgress?.(value[0])}
          />
        ) : (
          <Progress value={progress} className="h-2" />
        )}
      </div>
    </TableCell>
  );
}
