
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { hasPermission } from "@/types/performance-permissions";
import PerformanceGoalsTab from "@/components/performance/tabs/PerformanceGoalsTab";
import PerformanceRankingsTab from "@/components/performance/tabs/PerformanceRankingsTab";
import PerformanceAnalyticsTab from "@/components/performance/tabs/PerformanceAnalyticsTab";
import PerformanceSettingsTab from "@/components/performance/tabs/PerformanceSettingsTab";

interface PerformanceTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function PerformanceTabs({ activeTab, setActiveTab }: PerformanceTabsProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const canManageCycles = hasPermission(user.role, 'manage_cycles');
  const canManageTemplates = hasPermission(user.role, 'manage_templates');
  
  const navigateToTemplates = () => {
    navigate("/review-templates");
  };

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          {(canManageCycles || canManageTemplates) && (
            <TabsTrigger value="settings">Settings</TabsTrigger>
          )}
          {canManageTemplates && (
            <TabsTrigger value="templates" onClick={(e) => {
              e.preventDefault();
              navigateToTemplates();
            }}>
              Templates
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="goals">
          <PerformanceGoalsTab />
        </TabsContent>
        
        <TabsContent value="rankings">
          <PerformanceRankingsTab />
        </TabsContent>
        
        <TabsContent value="analytics">
          <PerformanceAnalyticsTab />
        </TabsContent>
        
        {(canManageCycles || canManageTemplates) && (
          <TabsContent value="settings">
            <PerformanceSettingsTab />
          </TabsContent>
        )}
      </Tabs>
    </Card>
  );
}
