
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { useNavigate } from "react-router-dom";
import { hasPermission } from "@/types/performance-permissions";
import PerformanceGoalsTab from "@/components/performance/tabs/PerformanceGoalsTab";
import PerformanceRankingsTab from "@/components/performance/tabs/PerformanceRankingsTab";
import PerformanceAnalyticsTab from "@/components/performance/tabs/PerformanceAnalyticsTab";
import PerformanceSettingsTab from "@/components/performance/tabs/PerformanceSettingsTab";
import { Goal } from "@/types";

interface PerformanceTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  canManageSettings?: boolean;
  canViewAnalytics?: boolean;
  performanceGoals?: Goal[];
  timeframe?: 'week' | 'month' | 'quarter' | 'year';
  handleExport?: (format: string) => void;
  onAddGoal?: (goal: Goal) => void;
  onUpdateGoal?: (goal: Goal) => void;
  onDeleteGoal?: (goalId: string) => void;
}

export default function PerformanceTabs({ 
  activeTab, 
  setActiveTab,
  canManageSettings,
  canViewAnalytics,
  performanceGoals = [],
  timeframe = 'quarter',
  handleExport,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal
}: PerformanceTabsProps) {
  const { user } = useSupabaseAuth();
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
          {(canManageCycles || canManageTemplates || canManageSettings) && (
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
          <PerformanceGoalsTab 
            goals={performanceGoals}
            onAddGoal={onAddGoal}
            onUpdateGoal={onUpdateGoal}
            onDeleteGoal={onDeleteGoal}
          />
        </TabsContent>
        
        <TabsContent value="rankings">
          <PerformanceRankingsTab />
        </TabsContent>
        
        <TabsContent value="analytics">
          <PerformanceAnalyticsTab />
        </TabsContent>
        
        {(canManageCycles || canManageTemplates || canManageSettings) && (
          <TabsContent value="settings">
            <PerformanceSettingsTab />
          </TabsContent>
        )}
      </Tabs>
    </Card>
  );
}
