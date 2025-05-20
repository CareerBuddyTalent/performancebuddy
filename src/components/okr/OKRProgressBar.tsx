
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

interface OKRProgressBarProps {
  progress: number;
  keyResultId: string;
  onUpdateProgress?: (id: string, newProgress: number) => void;
  readOnly?: boolean;
}

export default function OKRProgressBar({ 
  progress, 
  keyResultId,
  onUpdateProgress,
  readOnly = false
}: OKRProgressBarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [progressValue, setProgressValue] = useState(progress);
  
  const handleClick = () => {
    if (readOnly || !onUpdateProgress) return;
    setIsEditing(true);
  };
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgressValue(Number(e.target.value));
  };
  
  const handleBlur = () => {
    if (onUpdateProgress) {
      onUpdateProgress(keyResultId, progressValue);
    }
    setIsEditing(false);
  };
  
  const getProgressColor = (value: number) => {
    if (value < 30) return "bg-red-500";
    if (value < 70) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">Progress</div>
        {!isEditing ? (
          <div 
            className="text-sm font-medium cursor-pointer"
            onClick={handleClick}
          >
            {progressValue}%
          </div>
        ) : (
          <input
            type="number"
            value={progressValue}
            onChange={handleProgressChange}
            onBlur={handleBlur}
            min={0}
            max={100}
            className="w-16 h-6 text-sm border rounded px-1"
            autoFocus
          />
        )}
      </div>
      <Progress value={progressValue} className={`h-2 ${getProgressColor(progressValue)}`} />
    </div>
  );
}
