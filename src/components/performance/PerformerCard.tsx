
import { User } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { PerformanceScore, getScoreColor, getRankingIcon } from "@/utils/performanceUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface PerformerCardProps {
  performer: PerformanceScore;
}

export default function PerformerCard({ performer }: PerformerCardProps) {
  const scoreColor = getScoreColor(performer.score);
  const { Icon, color } = getRankingIcon(performer.ranking);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-14 w-14 border">
              <AvatarImage src={performer.user.profilePicture} alt={performer.user.name} />
              <AvatarFallback className="bg-primary/10 text-primary">{getInitials(performer.user.name)}</AvatarFallback>
            </Avatar>
            <div className="absolute -top-1 -right-1 rounded-full bg-white p-0.5 shadow-sm">
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium truncate">
              {performer.user.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {performer.user.position || performer.user.department || "—"}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <Badge className={`px-1.5 py-0.5 ${
                performer.score >= 4.5 ? "bg-green-500" : 
                performer.score >= 3.5 ? "bg-blue-500" :
                performer.score >= 2.5 ? "bg-yellow-500" : "bg-red-500"
              } text-white`}>
                {performer.score}
              </Badge>
              <span className="text-xs text-muted-foreground">
                avg. rating
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
