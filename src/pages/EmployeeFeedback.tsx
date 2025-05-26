
import { useState, useEffect } from "react";
import { useClerkAuth } from "@/context/ClerkAuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, User, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FeedbackEntry {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  type: string;
  is_anonymous: boolean;
  created_at: string;
}

export default function EmployeeFeedback() {
  const { user } = useClerkAuth();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    recipient_id: '',
    content: '',
    type: 'general',
    is_anonymous: false
  });

  useEffect(() => {
    if (user) {
      fetchFeedback();
    }
  }, [user]);

  const fetchFeedback = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedback(data || []);
    } catch (error: any) {
      console.error('Error fetching feedback:', error);
      toast({
        title: "Error",
        description: "Failed to load feedback",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newFeedback.content.trim()) return;

    try {
      const { error } = await supabase
        .from('feedback')
        .insert([{
          sender_id: user.id,
          recipient_id: newFeedback.recipient_id,
          content: newFeedback.content,
          type: newFeedback.type,
          is_anonymous: newFeedback.is_anonymous
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Feedback submitted successfully",
      });

      setNewFeedback({
        recipient_id: '',
        content: '',
        type: 'general',
        is_anonymous: false
      });
      setShowForm(false);
      fetchFeedback();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit feedback",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Please log in to view feedback.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Loading feedback...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const receivedFeedback = feedback.filter(f => f.recipient_id === user.id);
  const sentFeedback = feedback.filter(f => f.sender_id === user.id);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employee Feedback</h1>
          <p className="text-muted-foreground">
            Give and receive feedback from your colleagues
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Give Feedback
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Submit Feedback</CardTitle>
            <CardDescription>
              Provide constructive feedback to help your colleagues grow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Recipient</label>
                <Select value={newFeedback.recipient_id} onValueChange={(value) => 
                  setNewFeedback(prev => ({ ...prev, recipient_id: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a colleague" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="colleague1">John Doe</SelectItem>
                    <SelectItem value="colleague2">Jane Smith</SelectItem>
                    <SelectItem value="colleague3">Bob Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Feedback Type</label>
                <Select value={newFeedback.type} onValueChange={(value) => 
                  setNewFeedback(prev => ({ ...prev, type: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="praise">Praise</SelectItem>
                    <SelectItem value="constructive">Constructive</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Feedback</label>
                <Textarea
                  value={newFeedback.content}
                  onChange={(e) => setNewFeedback(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter your feedback..."
                  rows={4}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Submit Feedback
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Received Feedback ({receivedFeedback.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {receivedFeedback.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No feedback received yet
                </p>
              ) : (
                receivedFeedback.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={item.type === 'praise' ? 'default' : 'outline'}>
                        {item.type}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm">{item.content}</p>
                    {item.is_anonymous && (
                      <p className="text-xs text-muted-foreground mt-2">Anonymous feedback</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Sent Feedback ({sentFeedback.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sentFeedback.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No feedback sent yet
                </p>
              ) : (
                sentFeedback.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={item.type === 'praise' ? 'default' : 'outline'}>
                        {item.type}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm">{item.content}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
