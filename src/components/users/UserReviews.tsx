
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface UserReviewsProps {
  userName: string;
  userReviews: any[];
  getPerformanceColor: (rating: number) => string;
}

export default function UserReviews({ userName, userReviews, getPerformanceColor }: UserReviewsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Reviews</CardTitle>
        <CardDescription>
          Past performance reviews for {userName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userReviews.length > 0 ? (
          <div className="space-y-4">
            {userReviews.map(review => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Review from {new Date(review.updatedAt).toLocaleDateString()}</h3>
                  <Badge 
                    variant={review.status === "acknowledged" ? "default" : "outline"}
                    className="capitalize"
                  >
                    {review.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">Overall Rating:</span>
                  <span className={`font-bold ${getPerformanceColor(review.overallRating)}`}>
                    {review.overallRating.toFixed(1)}/5
                  </span>
                </div>
                <p className="mt-4 text-sm">
                  {review.feedback || "No feedback provided"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No reviews found for this user</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
