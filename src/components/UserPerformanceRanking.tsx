import { useMemo } from "react";
import { User } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, TrendingUp, LineChart } from "lucide-react";
import { reviews as mockReviews } from "@/data/mockData";

interface PerformanceScore {
  userId: string;
  user: User;
  score: number;
  lastReviewDate?: Date;
  ranking: number;
}

interface UserPerformanceRankingProps {
  users: User[];
}

export default function UserPerformanceRanking({ users }: UserPerformanceRankingProps) {
  // Calculate performance scores from mock review data
  const performanceScores = useMemo<PerformanceScore[]>(() => {
    // Get all unique user IDs from reviews
    const userIds = Array.from(new Set(mockReviews.map(review => review.employeeId)));
    
    // Calculate average scores for each user
    const scores = userIds.map(userId => {
      const userReviews = mockReviews.filter(review => review.employeeId === userId);
      const totalScore = userReviews.reduce((sum, review) => sum + review.overallRating, 0);
      const averageScore = userReviews.length > 0 ? totalScore / userReviews.length : 0;
      
      // Get the latest review date
      const lastReview = userReviews.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )[0];
      
      const user = users.find(u => u.id === userId);
      
      return {
        userId,
        user: user as User,
        score: parseFloat(averageScore.toFixed(2)),
        lastReviewDate: lastReview?.updatedAt,
        ranking: 0 // Will be set later
      };
    });
    
    // Sort by score (descending) and assign rankings
    const sortedScores = scores
      .filter(score => score.user) // Filter out users that don't exist in the users array
      .sort((a, b) => b.score - a.score);
    
    // Assign rankings
    sortedScores.forEach((score, index) => {
      score.ranking = index + 1;
    });
    
    return sortedScores;
  }, [users]);
  
  // Identify top performers (top 3)
  const topPerformers = performanceScores.slice(0, 3);
  // Other performers
  const otherPerformers = performanceScores.slice(3);
  
  const getRankingIcon = (ranking: number) => {
    switch (ranking) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Trophy className="h-5 w-5 text-amber-700" />;
      default:
        return <Star className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-600";
    if (score >= 3.5) return "text-blue-600";
    if (score >= 2.5) return "text-yellow-600";
    return "text-red-600";
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium flex items-center mb-4">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
          Top Performers
        </h3>
        
        <div className="grid gap-4 md:grid-cols-3">
          {topPerformers.map((performer) => (
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
          ))}
        </div>
      </div>
      
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
            {performanceScores.map((performer) => (
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
            
            {performanceScores.length === 0 && (
              <div className="p-6 text-center text-muted-foreground">
                No performance data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
