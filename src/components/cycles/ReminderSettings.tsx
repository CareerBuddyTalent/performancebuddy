
import { useCallback, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export interface ReminderTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  notificationType: "email" | "app" | "both";
  active: boolean;
}

export interface Reminder {
  id: string;
  templateId: string;
  cycleId: string;
  triggerDate: Date;
  triggerType: "before_start" | "after_start" | "before_end" | "custom";
  daysBefore: number;
  sentAt?: Date;
  status: "scheduled" | "sent" | "failed";
  recipientType: "everyone" | "reviewers" | "reviewees";
}

interface ReminderSettingsProps {
  templates: ReminderTemplate[];
  reminders: Reminder[];
  onAddTemplate: (template: Omit<ReminderTemplate, "id">) => void;
  onUpdateTemplate: (id: string, template: Partial<ReminderTemplate>) => void;
  onAddReminder: (reminder: Omit<Reminder, "id">) => void;
  onDeleteReminder: (id: string) => void;
}

export default function ReminderSettings({
  templates,
  reminders,
  onAddTemplate,
  onUpdateTemplate,
  onAddReminder,
  onDeleteReminder
}: ReminderSettingsProps) {
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Omit<ReminderTemplate, "id">>({
    name: "",
    subject: "",
    body: "",
    notificationType: "both",
    active: true
  });
  
  const handleSubmitTemplate = () => {
    onAddTemplate(newTemplate);
    setNewTemplate({
      name: "",
      subject: "",
      body: "",
      notificationType: "both",
      active: true
    });
    setIsAddingTemplate(false);
  };
  
  const renderReminderStatus = useCallback((status: Reminder["status"]) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      case "sent":
        return <Badge className="bg-green-600">Sent</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  }, []);

  const getTemplateName = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template ? template.name : "Unknown Template";
  }, [templates]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Email & Notification Templates</CardTitle>
            <CardDescription>
              Customize the messages sent to participants
            </CardDescription>
          </div>
          <Button 
            onClick={() => setIsAddingTemplate(!isAddingTemplate)}
            variant="outline"
          >
            {isAddingTemplate ? "Cancel" : "Add Template"}
          </Button>
        </CardHeader>
        <CardContent>
          {isAddingTemplate ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input 
                    id="template-name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                    placeholder="e.g., Review Deadline Reminder"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notification-type">Notification Type</Label>
                  <Select 
                    value={newTemplate.notificationType}
                    onValueChange={(value) => 
                      setNewTemplate({...newTemplate, notificationType: value as any})
                    }
                  >
                    <SelectTrigger id="notification-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email only</SelectItem>
                      <SelectItem value="app">In-app only</SelectItem>
                      <SelectItem value="both">Email & In-app</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {(newTemplate.notificationType === "email" || newTemplate.notificationType === "both") && (
                <div className="space-y-2">
                  <Label htmlFor="email-subject">Email Subject</Label>
                  <Input 
                    id="email-subject"
                    value={newTemplate.subject}
                    onChange={(e) => setNewTemplate({...newTemplate, subject: e.target.value})}
                    placeholder="e.g., Reminder: Your review deadline is approaching"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="message-body">Message Body</Label>
                <Textarea 
                  id="message-body"
                  value={newTemplate.body}
                  onChange={(e) => setNewTemplate({...newTemplate, body: e.target.value})}
                  placeholder="Type your message here. You can use variables like {{user}}, {{dueDate}}, etc."
                  rows={5}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingTemplate(false)}>Cancel</Button>
                <Button onClick={handleSubmitTemplate}>Save Template</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {templates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No templates have been created yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {templates.map((template) => (
                    <div key={template.id} className="py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {template.notificationType === "email" ? "Email only" :
                             template.notificationType === "app" ? "In-app only" :
                             "Email & In-app"}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={template.active}
                              onCheckedChange={(checked) => 
                                onUpdateTemplate(template.id, { active: checked })
                              }
                            />
                            <Label>Active</Label>
                          </div>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                      
                      {template.subject && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Subject: </span>
                          {template.subject}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Reminders</CardTitle>
          <CardDescription>
            View and manage upcoming notification schedules
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reminders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No reminders scheduled</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trigger Date</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reminders.map((reminder) => (
                  <TableRow key={reminder.id}>
                    <TableCell>{format(reminder.triggerDate, "PPP")}</TableCell>
                    <TableCell>{getTemplateName(reminder.templateId)}</TableCell>
                    <TableCell>
                      {reminder.recipientType === "everyone" ? "All participants" :
                       reminder.recipientType === "reviewers" ? "Reviewers only" :
                       "Reviewees only"}
                    </TableCell>
                    <TableCell>{renderReminderStatus(reminder.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onDeleteReminder(reminder.id)}
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
