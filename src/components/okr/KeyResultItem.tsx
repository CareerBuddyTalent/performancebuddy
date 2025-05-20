
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { KeyResult } from "@/types/okr";
import { format } from "date-fns";
import { Calendar, BarChart2 } from "lucide-react";

interface KeyResultItemProps {
  keyResult: KeyResult;
  onCheckIn: () => void;
}

export default function KeyResultItem({ keyResult, onCheckIn }: KeyResultItemProps) {
  const formatValue = (value: number, type: KeyResult['type']) => {
    switch (type) {
      case "percentage":
        return `${value}%`;
      case "currency":
        return `$${value.toLocaleString()}`;
      case "binary":
        return value === 1 ? "Complete" : "Incomplete";
      default:
        return value.toLocaleString();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "not_started":
        return "text-gray-500";
      case "in_progress":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="bg-muted/50 p-3 rounded-md">
      <div className="flex justify-between items-start mb-2">
        <div className="space-y-1">
          <h5 className="text-sm font-medium">{keyResult.title}</h5>
          <div className="text-xs text-muted-foreground flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            Due: {format(keyResult.dueDate, "MMM d, yyyy")}
          </div>
        </div>
        <div className={`px-2 py-1 text-xs rounded ${getStatusColor(keyResult.status)}`}>
          {keyResult.status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
        </div>
      </div>
      
      <div className="text-xs flex justify-between items-center mb-1">
        <span>
          Current: {formatValue(keyResult.currentValue, keyResult.type)}
        </span>
        <span>
          Target: {formatValue(keyResult.targetValue, keyResult.type)}
        </span>
      </div>
      
      <Progress value={keyResult.progress} className="h-1.5 mb-3" />
      
      <div className="flex justify-end">
        <Button size="sm" variant="ghost" className="text-xs h-7" onClick={onCheckIn}>
          <BarChart2 className="h-3 w-3 mr-1" />
          Check-in
        </Button>
      </div>
    </div>
  );
}
