
import { LineChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { PerformanceScore, getScoreColor } from "@/utils/performanceUtils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Rank</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead className="hidden md:table-cell">Department</TableHead>
            <TableHead className="w-[180px]">Performance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {performers.map((performer) => (
            <TableRow key={performer.userId} className="hover:bg-muted/30">
              <TableCell>
                <Badge 
                  variant={
                    showLowestFirst 
                      ? "outline" 
                      : performer.ranking <= 3 ? "default" : "outline"
                  } 
                  className={`w-6 h-6 flex items-center justify-center rounded-full ${
                    showLowestFirst ? "bg-muted text-muted-foreground" : 
                    performer.ranking === 1 ? "bg-yellow-500 border-yellow-500 text-white" :
                    performer.ranking === 2 ? "bg-gray-300 border-gray-300 text-gray-700" :
                    performer.ranking === 3 ? "bg-amber-700 border-amber-700 text-white" : ""
                  }`}
                >
                  {performer.ranking}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage src={performer.user.profilePicture} alt={performer.user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {performer.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="font-medium truncate">{performer.user.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {performer.user.position || "—"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {performer.user.department || "—"}
              </TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
