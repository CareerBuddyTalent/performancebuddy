
import { LineChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { PerformanceScore, getScoreColor } from "@/utils/performanceUtils";

interface PerformanceRankingTableProps {
  performers: PerformanceScore[];
}

export default function PerformanceRankingTable({ performers }: PerformanceRankingTableProps) {
  return (
    <div>
      <h3 className="text-lg font-medium flex items-center mb-4">
        <LineChart className="mr-2 h-5 w-5" />
        All Team Members Ranking
      </h3>
      
      <div className="border rounded-md">
        <div className="grid grid-cols-12 bg-muted p-3 text-sm font-medium border-b">
          <div className="col-span-1">Rank</div>
          <div className="col-span-4">Employee</div>
          <div className="col-span-2">Department</div>
          <div className="col-span-2">Position</div>
          <div className="col-span-3">Performance Score</div>
        </div>
        
        <div className="divide-y">
          {performers.map((performer) => (
            <div key={performer.userId} className="grid grid-cols-12 p-3 items-center hover:bg-muted/50">
              <div className="col-span-1 flex items-center">
                <Badge variant={performer.ranking <= 3 ? "default" : "outline"} className="w-6 h-6 flex items-center justify-center rounded-full p-0">
                  {performer.ranking}
                </Badge>
              </div>
              <div className="col-span-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={performer.user.profilePicture} alt={performer.user.name} />
                    <AvatarFallback>{performer.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{performer.user.name}</div>
                    <div className="text-xs text-muted-foreground">{performer.user.email}</div>
                  </div>
                </div>
              </div>
              <div className="col-span-2">{performer.user.department || "-"}</div>
              <div className="col-span-2">{performer.user.position || "-"}</div>
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <Progress value={performer.score * 20} className="h-2 flex-1" />
                  <span className={`text-sm font-bold ${getScoreColor(performer.score)}`}>
                    {performer.score}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {performers.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">
              No performance data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
