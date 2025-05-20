
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageSquare, Filter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Feedback } from "@/types/templates";

// Mock data for feedback
const mockFeedback: Feedback[] = [
  {
    id: "1",
    providerId: "manager1",
    recipientId: "employee1",
    content: "Great job on the sales presentation yesterday! The client was very impressed with your product knowledge and how you addressed their concerns.",
    type: "praise",
    visibility: "public",
    status: "published",
    createdAt: new Date("2025-05-15"),
    updatedAt: new Date("2025-05-15")
  },
  {
    id: "2",
    providerId: "manager1",
    recipientId: "employee2",
    content: "I'd like to see more initiative in upcoming team meetings. Your insights are valuable and would benefit the entire team.",
    type: "suggestion",
    visibility: "private",
    status: "published",
    createdAt: new Date("2025-05-10"),
    updatedAt: new Date("2025-05-10")
  }
];

export default function ContinuousFeedback() {
  const [feedback, setFeedback] = useState<Feedback[]>(mockFeedback);
  const [activeTab, setActiveTab] = useState<"given" | "received">("given");

  return (
    <div className="space-y-6">
      <Tabs defaultValue="given" value={activeTab} onValueChange={(value) => setActiveTab(value as "given" | "received")}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="given">Feedback Given</TabsTrigger>
            <TabsTrigger value="received">Feedback Received</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        
        <TabsContent value="given" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {feedback.length > 0 ? feedback.map(item => (
              <FeedbackCard key={item.id} feedback={item} />
            )) : (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No feedback given yet</p>
                <Button className="mt-4">Provide Feedback</Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="received" className="mt-6">
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No feedback received yet</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FeedbackCard({ feedback }: { feedback: Feedback }) {
  const recipientName = feedback.recipientId === "employee1" ? "John Doe" : "Emily Chen";
  const recipientAvatar = feedback.recipientId === "employee1" ? "https://ui-avatars.com/api/?name=John+Doe" : "https://ui-avatars.com/api/?name=Emily+Chen";
  
  const feedbackTypeStyles = {
    praise: "bg-green-100 text-green-800",
    suggestion: "bg-blue-100 text-blue-800",
    criticism: "bg-amber-100 text-amber-800"
  };
  
  const feedbackTypeLabels = {
    praise: "Praise",
    suggestion: "Suggestion",
    criticism: "Constructive Feedback"
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={recipientAvatar} />
              <AvatarFallback>{recipientName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-sm">{recipientName}</h3>
              <p className="text-xs text-muted-foreground">
                {format(feedback.createdAt, "MMM d, yyyy")}
              </p>
            </div>
          </div>
          <Badge className={feedbackTypeStyles[feedback.type]}>
            {feedbackTypeLabels[feedback.type]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{feedback.content}</p>
        
        <div className="flex justify-between mt-4 text-xs text-muted-foreground">
          <div className="flex items-center">
            <Badge variant={feedback.status === "acknowledged" ? "default" : "outline"} className="text-xs">
              {feedback.status === "published" ? "Sent" : 
               feedback.status === "acknowledged" ? "Acknowledged" : "Draft"}
            </Badge>
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className="text-xs">
              {feedback.visibility === "public" ? "Public" : 
               feedback.visibility === "team" ? "Team" : 
               feedback.visibility === "manager" ? "Manager Only" : "Private"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
