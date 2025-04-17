
import { useState } from "react";
import { Goal } from "@/types";
import { ChevronDown, Check, Edit, Trash } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

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
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase text-gray-400 border-b border-gray-800">
          <tr>
            <th className="px-4 py-3">Goal</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Weight</th>
            <th className="px-4 py-3">Metric</th>
            <th className="px-4 py-3">Unit</th>
            <th className="px-4 py-3">Progress</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Approved</th>
            {canEdit && <th className="px-4 py-3">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {goals.length > 0 ? (
            goals.map((goal) => (
              <PerformanceGoalRow 
                key={goal.id} 
                goal={goal} 
                canEdit={canEdit} 
                onEdit={onEditGoal}
                onDelete={onDeleteGoal}
                onUpdateStatus={onUpdateStatus}
                onUpdateProgress={onUpdateProgress}
              />
            ))
          ) : (
            <tr>
              <td colSpan={canEdit ? 9 : 8} className="px-4 py-8 text-center text-gray-400">
                No goals found. Add a goal to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

interface PerformanceGoalRowProps {
  goal: Goal;
  canEdit: boolean;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
  onUpdateStatus?: (goalId: string, status: string) => void;
  onUpdateProgress?: (goalId: string, progress: number) => void;
}

function PerformanceGoalRow({ 
  goal, 
  canEdit, 
  onEdit, 
  onDelete,
  onUpdateStatus,
  onUpdateProgress
}: PerformanceGoalRowProps) {
  const getStatusColor = (status: string, progress: number) => {
    if (status === "not_started" || progress < 25) return "text-red-500";
    if (progress < 50) return "text-orange-500";
    return "text-green-500";
  };

  const getStatusText = (status: string, progress: number) => {
    if (status === "not_started") return "Delayed";
    if (progress < 35) return "At risk";
    return "On track";
  };

  const getProgressColor = (progress: number) => {
    if (progress < 25) return "bg-red-500";
    if (progress < 50) return "bg-orange-500";
    return "bg-emerald-500";
  };

  const handleStatusChange = (newStatus: string) => {
    if (onUpdateStatus) {
      onUpdateStatus(goal.id, newStatus);
    }
  };

  const handleProgressUpdate = (newProgress: number) => {
    if (onUpdateProgress) {
      onUpdateProgress(goal.id, newProgress);
    }
  };

  const metric = goal.metrics?.[0];
  const statusText = getStatusText(goal.status, goal.progress);
  const statusColor = getStatusColor(goal.status, goal.progress);
  const progressColor = getProgressColor(goal.progress);

  return (
    <tr className="border-b border-gray-800 hover:bg-gray-900/50">
      <td className="px-4 py-4">
        <div className="flex items-center">
          <ChevronDown className="h-4 w-4 mr-2 text-gray-500" />
          <span>{goal.title}</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          <span>Your Company</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
          <span>20%</span>
        </div>
      </td>
      <td className="px-4 py-4">
        {metric && (
          <div>
            <span className="text-gray-400">1</span>
            <span className="mx-2">→</span>
            <span className="text-gray-300">{metric.current}</span>
            <span className="mx-2">→</span>
            <span className="text-gray-400">{metric.target}</span>
          </div>
        )}
      </td>
      <td className="px-4 py-4">
        {metric?.unit}
      </td>
      <td className="px-4 py-4">
        <div className="flex flex-col w-36">
          <div className="flex justify-between mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20V10"></path>
              <path d="M18 20V4"></path>
              <path d="M6 20v-4"></path>
            </svg>
            <span className="text-sm font-medium">{goal.progress}%</span>
          </div>
          <Progress 
            value={goal.progress} 
            className="h-2 bg-gray-700" 
            indicatorClassName={progressColor}
          />
        </div>
      </td>
      <td className="px-4 py-4">
        {canEdit ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={`flex items-center ${statusColor}`}
              >
                {statusText}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleStatusChange("not_started")}>
                Delayed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("in_progress")}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
                Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <span className={statusColor}>{statusText}</span>
        )}
      </td>
      <td className="px-4 py-4">
        <Check className="h-5 w-5 text-green-500" />
      </td>
      {canEdit && (
        <td className="px-4 py-4">
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onEdit && onEdit(goal)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDelete && onDelete(goal.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </td>
      )}
    </tr>
  );
}
