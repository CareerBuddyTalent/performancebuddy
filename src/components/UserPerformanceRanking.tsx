
import { useMemo } from "react";
import { User } from "@/types";
import { Trophy, Star, TrendingUp, LineChart } from "lucide-react";
import TopPerformers from "./performance/TopPerformers";
import PerformanceRankingTable from "./performance/PerformanceRankingTable";
import { calculatePerformanceScores, getScoreColor } from "@/utils/performanceUtils";

interface UserPerformanceRankingProps {
  users: User[];
}

export default function UserPerformanceRanking({ users }: UserPerformanceRankingProps) {
  // Calculate performance scores from mock review data
  const performanceScores = useMemo(() => {
    return calculatePerformanceScores(users);
  }, [users]);
  
  return (
    <div className="space-y-6">
      <TopPerformers performers={performanceScores} />
      <PerformanceRankingTable performers={performanceScores} />
    </div>
  );
}
