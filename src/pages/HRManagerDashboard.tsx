
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Plus, Settings } from "lucide-react";
import { ReviewTemplate } from "@/types/templates";
import { Objective } from "@/types/okr";

import CreateTemplateDialog from "@/components/templates/dialogs/CreateTemplateDialog";
import PrebuiltTemplateLibrary from "@/components/templates/PrebuiltTemplateLibrary";
import OKRAlignmentView from "@/components/okr/OKRAlignmentView";
import CycleScheduler, { CycleSchedule } from "@/components/cycles/CycleScheduler";
import ReminderSettings, { ReminderTemplate } from "@/components/cycles/ReminderSettings";
import PerformanceBenchmarkingDashboard from "@/components/analytics/PerformanceBenchmarkingDashboard";

// Importing mock data for demonstration purposes
import { mockTemplates } from "@/components/templates/mockTemplateData";
import { toast } from "sonner";

// Sample objects for demonstration
const sampleObjectives: Objective[] = [
  {
    id: "obj-company-1",
    userId: "system",
    title: "Increase Market Share by 10%",
    description: "Expand our market presence and gain 10% market share by end of year",
    status: "active",
    progress: 65,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    level: "company",
    createdAt: new Date(),
    updatedAt: new Date(),
    keyResults: []
  },
  {
    id: "obj-department-1",
    userId: "dept-1",
    title: "Launch 3 New Product Features",
    description: "Develop and release 3 major new features to drive adoption",
    status: "active",
    progress: 40,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 4)),
    alignedWith: "obj-company-1",
    level: "department",
    createdAt: new Date(),
    updatedAt: new Date(),
    keyResults: []
  },
  {
    id: "obj-team-1",
    userId: "team-1",
    title: "Achieve 95% Test Coverage",
    description: "Ensure codebase quality with comprehensive test coverage",
    status: "active",
    progress: 80,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
    alignedWith: "obj-department-1",
    level: "team",
    createdAt: new Date(),
    updatedAt: new Date(),
    keyResults: []
  },
  {
    id: "obj-individual-1",
    userId: "user-1",
    title: "Implement Authentication System",
    description: "Build secure authentication with role-based permissions",
    status: "active",
    progress: 90,
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    alignedWith: "obj-team-1",
    level: "individual",
    createdAt: new Date(),
    updatedAt: new Date(),
    keyResults: []
  }
];

// Define type for reminders to fix type issues
type ReminderType = {
  id: string;
  templateId: string;
  cycleId: string;
  triggerDate: Date;
  triggerType: "before_end" | "after_start";
  daysBefore: number;
  status: "scheduled";
  recipientType: "everyone" | "reviewers";
};

const sampleReminderTemplates: ReminderTemplate[] = [
  {
    id: "template-1",
    name: "Review Due Soon",
    subject: "Your performance review is due soon",
    body: "This is a friendly reminder that your performance review for {{cycleName}} is due in {{daysBefore}} days.",
    notificationType: "both",
    active: true
  },
  {
    id: "template-2",
    name: "Review Overdue",
    subject: "OVERDUE: Your performance review requires attention",
    body: "Your performance review for {{cycleName}} is now overdue. Please complete it as soon as possible.",
    notificationType: "both",
    active: true
  }
];

// Fix the reminders type to match the expected types
const sampleReminders: ReminderType[] = [
  {
    id: "reminder-1",
    templateId: "template-1",
    cycleId: "cycle-1",
    triggerDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    triggerType: "before_end",
    daysBefore: 3,
    status: "scheduled",
    recipientType: "everyone"
  },
  {
    id: "reminder-2",
    templateId: "template-2",
    cycleId: "cycle-1",
    triggerDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    triggerType: "after_start",
    daysBefore: 0,
    status: "scheduled",
    recipientType: "reviewers"
  }
];

export default function HRManagerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("templates");
  const [templates, setTemplates] = useState<ReviewTemplate[]>(mockTemplates);
  const [objectives, setObjectives] = useState<Objective[]>(sampleObjectives);
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);
  const [timeframe, setTimeframe] = useState<"week" | "month" | "quarter" | "year">("quarter");
  const [cycleSchedule, setCycleSchedule] = useState<CycleSchedule>({
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    isRecurring: false,
    recurringType: "quarterly",
    reminders: [
      { days: 7, type: "before_start", notificationType: "both" },
      { days: 3, type: "before_end", notificationType: "both" }
    ]
  });
  const [reminderTemplates, setReminderTemplates] = useState(sampleReminderTemplates);
  const [reminders, setReminders] = useState<ReminderType[]>(sampleReminders);
  
  if (!user) return null;
  
  const handleCreateTemplate = (template: ReviewTemplate) => {
    setTemplates([...templates, template]);
    setIsCreateTemplateOpen(false);
    toast.success("Template created successfully");
  };
  
  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast.success("Template deleted successfully");
  };
  
  const handleScheduleChange = (newSchedule: CycleSchedule) => {
    setCycleSchedule(newSchedule);
  };
  
  const handleAddTemplate = (template: Omit<ReminderTemplate, "id">) => {
    const newTemplate = {
      ...template,
      id: `template-${reminderTemplates.length + 1}`
    };
    setReminderTemplates([...reminderTemplates, newTemplate]);
    toast.success("Reminder template added successfully");
  };
  
  const handleUpdateTemplate = (id: string, templateUpdates: Partial<ReminderTemplate>) => {
    setReminderTemplates(prev => prev.map(t => 
      t.id === id ? { ...t, ...templateUpdates } : t
    ));
  };
  
  const handleAddReminder = (reminder: Omit<typeof reminders[0], "id">) => {
    const newReminder = {
      ...reminder,
      id: `reminder-${reminders.length + 1}`
    };
    setReminders([...reminders, newReminder]);
    toast.success("Reminder scheduled successfully");
  };
  
  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
    toast.success("Reminder deleted successfully");
  };
  
  const handleCreateObjective = (parentId?: string) => {
    // This would normally open a dialog to create a new objective
    console.log("Creating objective with parent:", parentId);
  };
  
  const handleViewObjective = (objective: Objective) => {
    // This would normally navigate to the objective detail page
    console.log("Viewing objective:", objective);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">HR Manager Dashboard</h1>
          <p className="text-muted-foreground">
            Configure and manage your organization's performance review processes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Global Settings
          </Button>
          {activeTab === "templates" && (
            <Button onClick={() => setIsCreateTemplateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-background border">
          <TabsTrigger value="templates">Review Templates</TabsTrigger>
          <TabsTrigger value="cycles">Review Cycles</TabsTrigger>
          <TabsTrigger value="okrs">OKR Alignment</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Benchmarking</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Review Templates</CardTitle>
              <CardDescription>
                Create, edit, and manage templates for different types of reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Pre-built Templates</h3>
                <PrebuiltTemplateLibrary onSelect={(template) => {
                  setTemplates([...templates, template]);
                  toast.success(`Template "${template.name}" added to your collection`);
                }} />
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Your Templates</h3>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {templates.map(template => (
                      <Card key={template.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base font-medium">{template.name}</CardTitle>
                            <Badge variant="outline">{template.type}</Badge>
                          </div>
                          <CardDescription className="text-sm line-clamp-1">
                            {template.description || "No description"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2 text-sm">
                          <div className="flex justify-between text-muted-foreground">
                            <span>{template.sections.length} sections</span>
                            <span>
                              {template.sections.reduce((acc, section) => acc + section.questions.length, 0)} questions
                            </span>
                          </div>
                        </CardContent>
                        <div className="px-6 pb-4 flex justify-between">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:bg-destructive/10" 
                            onClick={() => handleDeleteTemplate(template.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cycles" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Configure Review Cycle</CardTitle>
                  <CardDescription>
                    Set the timeline and recurrence of review cycles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CycleScheduler 
                    initialSchedule={cycleSchedule}
                    onScheduleChange={handleScheduleChange}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Configure automated reminders and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReminderSettings 
                    templates={reminderTemplates}
                    reminders={reminders}
                    onAddTemplate={handleAddTemplate}
                    onUpdateTemplate={handleUpdateTemplate}
                    onAddReminder={handleAddReminder}
                    onDeleteReminder={handleDeleteReminder}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="okrs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>OKR Alignment</CardTitle>
              <CardDescription>
                Manage company-wide OKRs and visualize alignments between different levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OKRAlignmentView 
                objectives={objectives}
                onCreateObjective={handleCreateObjective}
                onViewObjective={handleViewObjective}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics and Benchmarking</CardTitle>
              <CardDescription>
                View performance metrics, trends, and benchmarks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceBenchmarkingDashboard timeframe={timeframe} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <CreateTemplateDialog
        open={isCreateTemplateOpen}
        onOpenChange={setIsCreateTemplateOpen}
        onCreate={handleCreateTemplate}
      />
    </div>
  );
}
