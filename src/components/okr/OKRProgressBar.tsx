
import { cn } from "@/lib/utils";

interface OKRProgressBarProps {
  value: number;
  status: string;
  className?: string;
}

export function OKRProgressBar({ value, status, className }: OKRProgressBarProps) {
  const getProgressColor = () => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "ahead":
        return "bg-purple-500";
      case "on_track":
        return "bg-green-500";
      case "behind_schedule":
        return "bg-red-500";
      case "in_progress":
        return "bg-blue-500";
      case "not_started":
      case "canceled":
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className={cn("h-2 w-full bg-gray-200 rounded-full overflow-hidden", className)}>
      <div
        className={cn("h-full transition-all", getProgressColor())}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
