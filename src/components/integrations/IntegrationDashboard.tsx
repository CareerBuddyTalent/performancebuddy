
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvailableIntegrations } from "./AvailableIntegrations";
import { ActiveIntegrations } from "./ActiveIntegrations";
import { APIManagement } from "./APIManagement";
import { WebhookManager } from "./WebhookManager";

export function IntegrationDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API & Integrations</h1>
        <p className="text-muted-foreground">
          Connect with third-party services and manage API integrations
        </p>
      </div>
      
      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">Available Integrations</TabsTrigger>
          <TabsTrigger value="active">Active Integrations</TabsTrigger>
          <TabsTrigger value="api">API Management</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available">
          <AvailableIntegrations />
        </TabsContent>
        
        <TabsContent value="active">
          <ActiveIntegrations />
        </TabsContent>
        
        <TabsContent value="api">
          <APIManagement />
        </TabsContent>
        
        <TabsContent value="webhooks">
          <WebhookManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
