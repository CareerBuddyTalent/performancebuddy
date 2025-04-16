
import { Feedback, User } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface FeedbackCardProps {
  feedback: Feedback;
  sender?: User;
}

// Define badge variants based on feedback type
const badgeVariants = {
  praise: "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800",
  suggestion: "bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800",
  criticism: "bg-amber-100 text-amber-800 hover:bg-amber-100 hover:text-amber-800"
};

// Labels for feedback types
const feedbackTypeLabels = {
  praise: "Praise",
  suggestion: "Suggestion",
  criticism: "Constructive Feedback"
};

export default function FeedbackCard({ feedback, sender }: FeedbackCardProps) {
  const timeSince = formatDistanceToNow(feedback.createdAt, { addSuffix: true });
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
        {!feedback.isAnonymous && sender ? (
          <Avatar>
            <AvatarImage src={sender.profilePicture} />
            <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar>
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
        )}
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">
            {!feedback.isAnonymous && sender ? sender.name : "Anonymous"}
          </h4>
          <Badge variant="outline" className={badgeVariants[feedback.type]}>
            {feedbackTypeLabels[feedback.type]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{feedback.content}</p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        {timeSince}
      </CardFooter>
    </Card>
  );
}
