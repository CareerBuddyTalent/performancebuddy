
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
}

export function ProgressBar({ value, className }: ProgressBarProps) {
  return (
    <div className={cn("w-full bg-muted rounded-full h-1", className)}>
      <div 
        className="bg-primary rounded-full h-full transition-all duration-300"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
