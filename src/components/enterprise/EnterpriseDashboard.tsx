
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SSOLoginForm } from "@/components/auth/SSOLoginForm";
import { ComplianceAuditLog } from "@/components/compliance/ComplianceAuditLog";
import { ComplianceReports } from "@/components/compliance/ComplianceReports";
import { AdvancedPermissions } from "@/components/security/AdvancedPermissions";
import { SecurityDashboard } from "@/components/security/SecurityDashboard";
import { PerformanceOptimization } from "@/components/scalability/PerformanceOptimization";

export function EnterpriseDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Enterprise Features</h1>
        <p className="text-muted-foreground">
          Advanced enterprise-grade features for security, compliance, and scalability
        </p>
      </div>
      
      <Tabs defaultValue="security" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="sso">SSO Integration</TabsTrigger>
          <TabsTrigger value="scalability">Scalability</TabsTrigger>
        </TabsList>
        
        <TabsContent value="security">
          <div className="space-y-6">
            <SecurityDashboard />
            <AdvancedPermissions />
          </div>
        </TabsContent>
        
        <TabsContent value="compliance">
          <div className="space-y-6">
            <ComplianceReports />
            <ComplianceAuditLog />
          </div>
        </TabsContent>
        
        <TabsContent value="sso">
          <div className="max-w-md mx-auto">
            <SSOLoginForm />
          </div>
        </TabsContent>
        
        <TabsContent value="scalability">
          <PerformanceOptimization />
        </TabsContent>
      </Tabs>
    </div>
  );
}
