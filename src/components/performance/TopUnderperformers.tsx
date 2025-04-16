
import { useMemo } from "react";
import { User } from "@/types";
import { calculatePerformanceScores } from "@/utils/performanceUtils";
import PerformanceRankingTable from "./PerformanceRankingTable";
import { PerformanceScore } from "@/utils/performanceUtils";

interface TopUnderperformersProps {
  users: User[];
  limit?: number;
}

export default function TopUnderperformers({ users, limit = 5 }: TopUnderperformersProps) {
  // Calculate performance scores and get the lowest performers
  const underperformers = useMemo(() => {
    const allScores = calculatePerformanceScores(users);
    // Sort by score ascending (lowest first)
    const sortedByLowest = [...allScores].sort((a, b) => a.score - b.score);
    return sortedByLowest.slice(0, limit);
  }, [users, limit]);
  
  return (
    <div className="space-y-6">
      <PerformanceRankingTable 
        performers={underperformers} 
        showLowestFirst={true}
      />
    </div>
  );
}
