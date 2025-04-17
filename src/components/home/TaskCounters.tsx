
import { FileText, TrendingUp, UserPlus, FileCheck } from "lucide-react";

interface TaskCountersProps {
  todoCount: number;
  performanceCount: number;
  recruitmentCount: number;
  hrCount: number;
}

export default function TaskCounters({ 
  todoCount, 
  performanceCount, 
  recruitmentCount, 
  hrCount 
}: TaskCountersProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xl font-bold">{todoCount}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">To do's</div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xl font-bold">{performanceCount}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Performance</div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center text-green-600 dark:text-green-400">
          <UserPlus className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xl font-bold">{recruitmentCount}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Recruitment</div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <FileCheck className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xl font-bold">{hrCount}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">HR</div>
        </div>
      </div>
    </div>
  );
}
