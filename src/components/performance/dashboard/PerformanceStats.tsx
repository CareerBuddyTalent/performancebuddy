
import { Goal } from "@/types";
import PerformanceStatsCards from "../PerformanceStatsCards";

interface PerformanceStatsProps {
  performanceGoals: Goal[];
}

export default function PerformanceStats({ performanceGoals }: PerformanceStatsProps) {
  // Calculate stats
  const goalsCompletion = performanceGoals.length > 0 
    ? Math.round((performanceGoals.filter(g => g.status === 'completed').length / performanceGoals.length) * 100) 
    : 0;
    
  const activeGoalsCount = performanceGoals.filter(g => g.status !== 'completed').length;
  const roadmapCompletion = performanceGoals.length > 0 
    ? Math.round(performanceGoals.reduce((sum, goal) => sum + goal.progress, 0) / performanceGoals.length) 
    : 0;

  return (
    <PerformanceStatsCards 
      goalsCompletion={goalsCompletion} 
      roadmapCompletion={roadmapCompletion} 
      activeGoalsCount={activeGoalsCount}
    />
  );
}
