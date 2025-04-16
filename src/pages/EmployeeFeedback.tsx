
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeedbackCard from "@/components/FeedbackCard";
import FeedbackDialog from "@/components/FeedbackDialog";
import { feedbackEntries, users } from "@/data/mockData";
import { Feedback } from "@/types";
import { MessageSquareText, Search, SendHorizontal } from "lucide-react";

export default function EmployeeFeedback() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackList, setFeedbackList] = useState(feedbackEntries);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  
  if (!user) return null;
  
  // Filter feedback based on user role and search query
  const receivedFeedback = feedbackList.filter(f => f.recipientId === user.id);
  const sentFeedback = feedbackList.filter(f => f.senderId === user.id);
  
  const filteredReceivedFeedback = receivedFeedback.filter(feedback => 
    feedback.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredSentFeedback = sentFeedback.filter(feedback => 
    feedback.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddFeedback = (newFeedback: Feedback) => {
    setFeedbackList(prev => [newFeedback, ...prev]);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
        <p className="text-muted-foreground">
          {user.role === 'employee'
            ? "View feedback you've received and provide feedback to others"
            : "Manage feedback across your team and organization"}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search feedback..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setShowFeedbackDialog(true)}>
          <SendHorizontal className="mr-2 h-4 w-4" />
          Give Feedback
        </Button>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="received" className="space-y-4">
        <TabsList>
          <TabsTrigger value="received">
            Received ({filteredReceivedFeedback.length})
          </TabsTrigger>
          <TabsTrigger value="sent">
            Sent ({filteredSentFeedback.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="received" className="space-y-4">
          {filteredReceivedFeedback.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredReceivedFeedback.map((feedback: Feedback) => (
                <FeedbackCard 
                  key={feedback.id} 
                  feedback={feedback} 
                  sender={users.find(u => u.id === feedback.senderId)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <MessageSquareText className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="text-lg font-medium">No feedback received yet</h3>
              <p className="text-muted-foreground text-center max-w-md">
                You haven't received any feedback yet. When someone gives you feedback, it will appear here.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="sent" className="space-y-4">
          {filteredSentFeedback.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSentFeedback.map((feedback: Feedback) => (
                <FeedbackCard 
                  key={feedback.id} 
                  feedback={feedback} 
                  sender={users.find(u => u.id === feedback.recipientId)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <MessageSquareText className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="text-lg font-medium">No feedback sent yet</h3>
              <p className="text-muted-foreground text-center max-w-md">
                You haven't sent any feedback yet. Use the "Give Feedback" button to provide feedback to your colleagues.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <FeedbackDialog
        open={showFeedbackDialog}
        onOpenChange={setShowFeedbackDialog}
        onSubmit={handleAddFeedback}
        currentUser={user}
      />
    </div>
  );
}
