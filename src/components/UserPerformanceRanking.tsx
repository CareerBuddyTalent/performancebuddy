
import { useMemo } from "react";
import { User } from "@/types";
import { Trophy, Star, TrendingUp, LineChart } from "lucide-react";
import TopPerformers from "./performance/TopPerformers";
import PerformanceRankingTable from "./performance/PerformanceRankingTable";
import { calculatePerformanceScores, getScoreColor } from "@/utils/performanceUtils";

interface UserPerformanceRankingProps {
  users: User[];
  limit?: number;
}

export default function UserPerformanceRanking({ users, limit }: UserPerformanceRankingProps) {
  // Calculate performance scores from mock review data
  const performanceScores = useMemo(() => {
    const scores = calculatePerformanceScores(users);
    return limit ? scores.slice(0, limit) : scores;
  }, [users, limit]);
  
  return (
    <div className="space-y-6">
      {!limit && <TopPerformers performers={performanceScores.slice(0, 3)} />}
      <PerformanceRankingTable performers={performanceScores} />
    </div>
  );
}
