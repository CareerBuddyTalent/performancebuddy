
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ReviewProgressProps {
  totalReviews: number;
  completedReviews: number;
  inProgressReviews: number;
  notStartedReviews: number;
}

export default function ReviewProgress({
  totalReviews,
  completedReviews,
  inProgressReviews,
  notStartedReviews
}: ReviewProgressProps) {
  // Calculate percentages
  const completedPercentage = (completedReviews / totalReviews) * 100;
  const inProgressPercentage = (inProgressReviews / totalReviews) * 100;
  const notStartedPercentage = (notStartedReviews / totalReviews) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Progress</CardTitle>
        <CardDescription>Current review cycle progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-purple-400"></div>
                <span className="text-sm font-medium">Completed</span>
              </div>
              <span className="text-sm font-medium">
                {completedReviews} of {totalReviews} ({Math.round(completedPercentage)}%)
              </span>
            </div>
            <Progress value={completedPercentage} className="h-2 bg-muted" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                <span className="text-sm font-medium">In Progress</span>
              </div>
              <span className="text-sm font-medium">
                {inProgressReviews} of {totalReviews} ({Math.round(inProgressPercentage)}%)
              </span>
            </div>
            <Progress value={inProgressPercentage} className="h-2 bg-muted" style={{ "--progress-indicator-color": "rgb(251 191 36)" } as React.CSSProperties} />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-slate-400"></div>
                <span className="text-sm font-medium">Not Started</span>
              </div>
              <span className="text-sm font-medium">
                {notStartedReviews} of {totalReviews} ({Math.round(notStartedPercentage)}%)
              </span>
            </div>
            <Progress value={notStartedPercentage} className="h-2 bg-muted" style={{ "--progress-indicator-color": "rgb(148 163 184)" } as React.CSSProperties} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
