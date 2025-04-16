
import { User } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { PerformanceScore, getScoreColor, getRankingIcon } from "@/utils/performanceUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-14 w-14">
              <AvatarImage src={performer.user.profilePicture} alt={performer.user.name} />
              <AvatarFallback>{getInitials(performer.user.name)}</AvatarFallback>
            </Avatar>
            <div className="absolute -top-1 -right-1 rounded-full bg-white p-0.5">
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium truncate">
              {performer.user.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {performer.user.position}
            </p>
            <div className="mt-1 flex items-center">
              <span className={`text-lg font-bold ${scoreColor}`}>
                {performer.score}
              </span>
              <span className="text-xs ml-1 text-muted-foreground">
                avg. rating
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
