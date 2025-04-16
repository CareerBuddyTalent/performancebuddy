
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import { PerformanceScore, getScoreColor, getRankingIcon } from "@/utils/performanceUtils";

interface PerformerCardProps {
  performer: PerformanceScore;
}

export default function PerformerCard({ performer }: PerformerCardProps) {
  return (
    <Card key={performer.userId} className="overflow-hidden">
      <div className={`h-2 ${performer.ranking === 1 ? 'bg-yellow-500' : performer.ranking === 2 ? 'bg-gray-400' : 'bg-amber-700'}`}></div>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <Avatar className="h-12 w-12 border-2 border-background">
              <AvatarImage src={performer.user.profilePicture} alt={performer.user.name} />
              <AvatarFallback>{performer.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
              {getRankingIcon(performer.ranking)}
            </div>
          </div>
          <div>
            <div className="font-medium">{performer.user.name}</div>
            <div className="text-sm text-muted-foreground">{performer.user.position || "No position"}</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Performance Score:</span>
            <span className={`font-bold ${getScoreColor(performer.score)}`}>
              {performer.score}/5
            </span>
          </div>
          <Progress value={performer.score * 20} className="h-2" />
          <div className="flex justify-between text-xs">
            <span>Department: {performer.user.department || "N/A"}</span>
            <span className="flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              Top {performer.ranking}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
