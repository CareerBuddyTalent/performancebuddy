
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, CheckCircle } from "lucide-react";

interface Review {
  id: string;
  cycleId: string;
  cycleName: string;
  submittedDate: string;
  status: "completed" | "in_progress" | "pending";
  overallRating: number;
  feedback?: string;
}

interface PastReviewsProps {
  reviews: Review[];
}

export default function PastReviews({ reviews }: PastReviewsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "in_progress":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "pending":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "";
    }
  };

  const getRatingStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          }`}
        />
      ));
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Past Reviews</CardTitle>
        <CardDescription>Your previous performance reviews</CardDescription>
      </CardHeader>
      <CardContent>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{review.cycleName}</h3>
                  <Badge className={getStatusColor(review.status)}>
                    <span className="flex items-center">
                      {getStatusIcon(review.status)}
                      <span className="ml-1 capitalize">{review.status.replace("_", " ")}</span>
                    </span>
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Submitted on {new Date(review.submittedDate).toLocaleDateString()}
                </p>
                <div className="mt-4">
                  <div className="flex items-center">
                    <span className="mr-2 text-sm font-medium">Overall Rating:</span>
                    <div className="flex items-center">{getRatingStars(review.overallRating)}</div>
                  </div>
                  {review.feedback && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">Manager Feedback:</span>
                      <p className="mt-1 text-sm text-muted-foreground">{review.feedback}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No past reviews</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You haven't completed any reviews yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
