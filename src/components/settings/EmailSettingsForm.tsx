import React, { useState } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function EmailSettingsForm() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true); // Example state

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Simulate saving settings
    toast({
      title: "Settings Saved",
      description: "Your email preferences have been updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Preferences</CardTitle>
        <CardDescription>
          Manage your email notification settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">
              Receive email notifications
            </Label>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={(checked) => setEmailNotifications(checked)}
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              defaultValue={user?.email} 
              disabled 
            />
          </div>

          <Button type="submit">
            Save Preferences
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
