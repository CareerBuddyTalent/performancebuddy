
import { Progress } from "@/components/ui/progress";

interface OKRProgressBarProps {
  percentage: number;
  status: string;
}

export function OKRProgressBar({ percentage, status }: OKRProgressBarProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'on_track': return 'bg-blue-500';
      case 'behind_schedule': return 'bg-red-500';
      case 'ahead': return 'bg-green-400';
      case 'in_progress': return 'bg-amber-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className={`font-medium capitalize ${percentage >= 100 ? 'text-green-600 dark:text-green-500' : ''}`}>
          {percentage}% Complete
        </span>
        <span className="text-muted-foreground capitalize">
          {status.replace('_', ' ')}
        </span>
      </div>
      <Progress 
        value={percentage} 
        className={`h-2 ${getStatusColor(status)}`} 
      />
    </div>
  );
}
