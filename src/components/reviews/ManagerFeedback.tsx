
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, UserCircle } from "lucide-react";

interface ManagerFeedbackProps {
  feedback: string;
  managerName?: string;
  dateSubmitted: string;
  status: "completed" | "in_progress" | "pending";
}

export default function ManagerFeedback({
  feedback,
  managerName = "Your Manager",
  dateSubmitted,
  status
}: ManagerFeedbackProps) {
  const getBadgeVariant = () => {
    switch(status) {
      case "completed": return "default";
      case "in_progress": return "secondary";
      case "pending": return "outline";
      default: return "secondary";
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <CardTitle className="text-lg font-medium">Manager Feedback</CardTitle>
          <Badge variant={getBadgeVariant()}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {feedback ? (
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <UserCircle className="h-5 w-5 mt-1 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">{managerName}</p>
                <p className="text-sm text-muted-foreground">
                  Submitted on {new Date(dateSubmitted).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <MessageSquare className="h-5 w-5 mt-1 text-muted-foreground" />
              <p className="flex-1 text-sm">{feedback}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No manager feedback available yet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

