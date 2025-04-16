
import { LineChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { PerformanceScore, getScoreColor } from "@/utils/performanceUtils";

interface PerformanceRankingTableProps {
  performers: PerformanceScore[];
  showLowestFirst?: boolean;
}

export default function PerformanceRankingTable({ performers, showLowestFirst = false }: PerformanceRankingTableProps) {
  // No performers case
  if (performers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No performance data available
      </div>
    );
  }
  
  return (
    <div className="overflow-hidden rounded-md border">
      <div className="grid grid-cols-12 bg-muted/50 py-2.5 px-4 text-xs font-medium text-muted-foreground">
        <div className="col-span-1">Rank</div>
        <div className="col-span-5">Employee</div>
        <div className="hidden md:block col-span-3 md:col-span-3">Department</div>
        <div className="col-span-3">Performance</div>
      </div>
      
      <div className="divide-y">
        {performers.map((performer) => (
          <div 
            key={performer.userId} 
            className="grid grid-cols-12 py-3 px-4 items-center hover:bg-muted/30 transition-colors"
          >
            <div className="col-span-1 flex items-center">
              <Badge 
                variant={
                  showLowestFirst 
                    ? "outline" 
                    : performer.ranking <= 3 ? "default" : "outline"
                } 
                className={`w-6 h-6 flex items-center justify-center rounded-full p-0 ${
                  showLowestFirst ? "bg-muted text-muted-foreground" : 
                  performer.ranking === 1 ? "bg-yellow-500 border-yellow-500 text-white" :
                  performer.ranking === 2 ? "bg-gray-300 border-gray-300 text-gray-700" :
                  performer.ranking === 3 ? "bg-amber-700 border-amber-700 text-white" : ""
                }`}
              >
                {performer.ranking}
              </Badge>
            </div>
            <div className="col-span-5">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={performer.user.profilePicture} alt={performer.user.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">{performer.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="font-medium truncate">{performer.user.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{performer.user.position || "—"}</div>
                </div>
              </div>
            </div>
            <div className="hidden md:block col-span-3 md:col-span-3 truncate text-sm">
              {performer.user.department || "—"}
            </div>
            <div className="col-span-3">
              <div className="flex items-center gap-2">
                <Progress 
                  value={performer.score * 20} 
                  className="h-2 flex-1" 
                  indicatorClassName={`${
                    performer.score >= 4.5 ? "bg-green-500" : 
                    performer.score >= 3.5 ? "bg-blue-500" :
                    performer.score >= 2.5 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                />
                <span className={`text-sm font-bold ${getScoreColor(performer.score)}`}>
                  {performer.score}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
