
import { Dispatch, SetStateAction } from "react";
import { Goal } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PerformanceGoalsTab from "./tabs/PerformanceGoalsTab";
import PerformanceRankingsTab from "./tabs/PerformanceRankingsTab";
import PerformanceAnalyticsTab from "./tabs/PerformanceAnalyticsTab";
import PerformanceSettingsTab from "./tabs/PerformanceSettingsTab";

interface PerformanceTabsProps {
  isAdmin: boolean;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  performanceGoals: Goal[];
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  handleExport: (format: string) => void;
  onAddGoal?: (goal: Goal) => void;
  onUpdateGoal?: (goal: Goal) => void;
  onDeleteGoal?: (goalId: string) => void;
}

export default function PerformanceTabs({
  isAdmin,
  activeTab,
  setActiveTab,
  performanceGoals,
  timeframe,
  handleExport,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal
}: PerformanceTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="goals">Goals</TabsTrigger>
        <TabsTrigger value="rankings">Rankings</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        {isAdmin && <TabsTrigger value="settings">Settings</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="goals" className="space-y-4">
        <PerformanceGoalsTab 
          goals={performanceGoals} 
          onAddGoal={onAddGoal}
          onUpdateGoal={onUpdateGoal}
          onDeleteGoal={onDeleteGoal}
        />
      </TabsContent>
      
      <TabsContent value="rankings" className="space-y-4">
        <PerformanceRankingsTab />
      </TabsContent>
      
      <TabsContent value="analytics" className="space-y-4">
        <PerformanceAnalyticsTab />
      </TabsContent>
      
      {isAdmin && (
        <TabsContent value="settings" className="space-y-4">
          <PerformanceSettingsTab />
        </TabsContent>
      )}
    </Tabs>
  );
}
