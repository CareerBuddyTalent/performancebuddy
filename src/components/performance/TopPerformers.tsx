
import { Trophy } from "lucide-react";
import { PerformanceScore } from "@/utils/performanceUtils";
import PerformerCard from "./PerformerCard";

interface TopPerformersProps {
  performers: PerformanceScore[];
}

export default function TopPerformers({ performers }: TopPerformersProps) {
  // Get top 3 performers
  const topPerformers = performers.slice(0, 3);
  
  if (topPerformers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No top performers data available
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="text-lg font-medium flex items-center mb-4">
        <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
        Top Performers
      </h3>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {topPerformers.map((performer) => (
          <PerformerCard key={performer.userId} performer={performer} />
        ))}
      </div>
    </div>
  );
}
