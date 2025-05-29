
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface EmailPreferences {
  reviewReminders: boolean;
  goalDeadlines: boolean;
  feedbackReceived: boolean;
  surveyReminders: boolean;
  cycleNotifications: boolean;
  digestFrequency: 'immediate' | 'daily' | 'weekly' | 'disabled';
}

export default function EmailNotificationSettings() {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<EmailPreferences>({
    reviewReminders: true,
    goalDeadlines: true,
    feedbackReceived: true,
    surveyReminders: true,
    cycleNotifications: true,
    digestFrequency: 'immediate',
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handlePreferenceChange = (key: keyof EmailPreferences, value: boolean | string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would save to the database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: "Your email notification preferences have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Notifications</CardTitle>
        <CardDescription>
          Configure when and how you receive email notifications from PerformPath.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Notification Types</h4>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="review-reminders">Performance Review Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when performance reviews are due
              </p>
            </div>
            <Switch
              id="review-reminders"
              checked={preferences.reviewReminders}
              onCheckedChange={(checked) => handlePreferenceChange('reviewReminders', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="goal-deadlines">Goal Deadline Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts when your goals are approaching deadlines
              </p>
            </div>
            <Switch
              id="goal-deadlines"
              checked={preferences.goalDeadlines}
              onCheckedChange={(checked) => handlePreferenceChange('goalDeadlines', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="feedback-received">New Feedback Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when you receive new feedback
              </p>
            </div>
            <Switch
              id="feedback-received"
              checked={preferences.feedbackReceived}
              onCheckedChange={(checked) => handlePreferenceChange('feedbackReceived', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="survey-reminders">Survey Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Reminders for incomplete surveys and assessments
              </p>
            </div>
            <Switch
              id="survey-reminders"
              checked={preferences.surveyReminders}
              onCheckedChange={(checked) => handlePreferenceChange('surveyReminders', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="cycle-notifications">Cycle Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Updates about new performance cycles and important announcements
              </p>
            </div>
            <Switch
              id="cycle-notifications"
              checked={preferences.cycleNotifications}
              onCheckedChange={(checked) => handlePreferenceChange('cycleNotifications', checked)}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label htmlFor="digest-frequency">Email Frequency</Label>
          <Select 
            value={preferences.digestFrequency} 
            onValueChange={(value) => handlePreferenceChange('digestFrequency', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate - Send emails right away</SelectItem>
              <SelectItem value="daily">Daily Digest - Once per day summary</SelectItem>
              <SelectItem value="weekly">Weekly Digest - Once per week summary</SelectItem>
              <SelectItem value="disabled">Disabled - No email notifications</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Control how often you receive email notifications. Important security emails will always be sent immediately.
          </p>
        </div>

        <Separator />

        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
}
