
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowBuilder } from "./WorkflowBuilder";
import { ActiveWorkflows } from "./ActiveWorkflows";
import { WorkflowTemplates } from "./WorkflowTemplates";
import { WorkflowAnalytics } from "./WorkflowAnalytics";

export function WorkflowDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Workflow Automation</h1>
        <p className="text-muted-foreground">
          Create custom workflows to automate HR processes and improve efficiency
        </p>
      </div>
      
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Workflows</TabsTrigger>
          <TabsTrigger value="builder">Workflow Builder</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <ActiveWorkflows />
        </TabsContent>
        
        <TabsContent value="builder">
          <WorkflowBuilder />
        </TabsContent>
        
        <TabsContent value="templates">
          <WorkflowTemplates />
        </TabsContent>
        
        <TabsContent value="analytics">
          <WorkflowAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
