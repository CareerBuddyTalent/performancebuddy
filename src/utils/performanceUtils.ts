
import { User } from "@/types";
import { reviews as mockReviews } from "@/data/mockData";
import { Trophy, Star } from "lucide-react";

export interface PerformanceScore {
  userId: string;
  user: User;
  score: number;
  lastReviewDate?: Date;
  ranking: number;
}

export const calculatePerformanceScores = (users: User[]): PerformanceScore[] => {
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
};

export const getScoreColor = (score: number): string => {
  if (score >= 4.5) return "text-green-600";
  if (score >= 3.5) return "text-blue-600";
  if (score >= 2.5) return "text-yellow-600";
  return "text-red-600";
};

export const getRankingIcon = (ranking: number) => {
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
