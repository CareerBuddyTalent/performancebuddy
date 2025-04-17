
import { useState } from "react";
import { Goal } from "@/types";
import { Search, Plus, Settings, MoreHorizontal, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useCompany } from "@/context/CompanyContext";
import { useNotifications } from "@/hooks/use-notifications";
import { toast } from "@/hooks/use-toast";
import PerformanceStatsCards from "./PerformanceStatsCards";
import PerformanceTabs from "./PerformanceTabs";

// Mock performance goals data
const performanceGoals: Goal[] = [
  {
    id: "1",
    userId: "user1",
    title: "Dream Team",
    description: "Build a high-performing team",
    dueDate: new Date(2024, 11, 31),
    status: "in_progress",
    progress: 71,
    createdAt: new Date(),
    updatedAt: new Date(),
    level: "company",
    metrics: [
      { name: "Team members", target: 75000, current: 53250, unit: "£" }
    ]
  },
  {
    id: "2",
    userId: "user1",
    title: "Fast Growth",
    description: "Achieve rapid growth targets",
    dueDate: new Date(2024, 11, 31),
    status: "in_progress",
    progress: 31,
    createdAt: new Date(),
    updatedAt: new Date(),
    level: "company",
    metrics: [
      { name: "New users", target: 75, current: 23, unit: "people" }
    ]
  },
  {
    id: "3",
    userId: "user1",
    title: "Profitability",
    description: "Increase profit margins",
    dueDate: new Date(2024, 11, 31),
    status: "in_progress",
    progress: 75,
    createdAt: new Date(),
    updatedAt: new Date(),
    level: "company",
    metrics: [
      { name: "Profit margin", target: 23, current: 19, unit: "%" }
    ]
  },
  {
    id: "4",
    userId: "user1",
    title: "Deliver WOW",
    description: "Exceed customer expectations",
    dueDate: new Date(2024, 11, 31),
    status: "not_started",
    progress: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
    level: "company",
    metrics: [
      { name: "Delivery time", target: 5, current: 9, unit: "Days" }
    ]
  },
  {
    id: "5",
    userId: "user1",
    title: "Customer Service",
    description: "Improve customer satisfaction",
    dueDate: new Date(2024, 11, 31),
    status: "in_progress",
    progress: 54,
    createdAt: new Date(),
    updatedAt: new Date(),
    level: "company",
    metrics: [
      { name: "Satisfaction score", target: 100, current: 77, unit: "%" }
    ]
  }
];

export default function PerformanceDashboard() {
  const { user } = useAuth();
  const { companies, currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("goals");
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('quarter');
  const { addNotification } = useNotifications();
  
  const goalsCompletion = 50;
  const roadmapCompletion = 73;
  
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  
  const handleExport = (format: string) => {
    // Add a notification
    addNotification({
      title: `Exporting ${timeframe}ly report`,
      description: `Your ${timeframe}ly performance report is being generated as ${format.toUpperCase()}`,
      type: 'info',
    });

    // Show a toast
    toast({
      title: "Export started",
      description: `Your ${timeframe}ly report will be ready shortly.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Performance</h1>
          <p className="text-muted-foreground">
            Manage and track performance metrics across the organization
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <PerformanceStatsCards 
        goalsCompletion={goalsCompletion} 
        roadmapCompletion={roadmapCompletion} 
        activeGoalsCount={performanceGoals.length}
      />

      {/* Tab Navigation */}
      <PerformanceTabs 
        isAdmin={isAdmin} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        performanceGoals={performanceGoals} 
        timeframe={timeframe}
        handleExport={handleExport}
      />
    </div>
  );
}
