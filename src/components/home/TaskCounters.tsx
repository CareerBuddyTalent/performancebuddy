
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
    <div className="flex space-x-4 overflow-x-auto">
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
        <span className="text-xl font-bold">{todoCount}</span>
        <span className="text-sm">To do's</span>
      </div>
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
        <span className="text-xl font-bold">{performanceCount}</span>
        <span className="text-sm">Performance</span>
      </div>
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
        <span className="text-xl font-bold">{recruitmentCount}</span>
        <span className="text-sm">Recruitment</span>
      </div>
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
        <span className="text-xl font-bold">{hrCount}</span>
        <span className="text-sm">HR</span>
      </div>
    </div>
  );
}
