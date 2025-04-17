
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCompany } from "@/context/CompanyContext";
import { Goal } from "@/types";
import { Search, Plus, Settings, MoreHorizontal, ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PerformanceGoalTable from "@/components/performance/PerformanceGoalTable";
import PerformanceRankingsDashboard from "@/components/performance/PerformanceRankingsDashboard";
import PerformanceTrendsChart from "@/components/analytics/PerformanceTrendsChart";
import { toast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/use-notifications";

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

export default function Performance() {
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-amber-500 text-3xl font-bold">{goalsCompletion}%</div>
            <p className="text-sm text-muted-foreground">Goals Completion</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-emerald-500 text-3xl font-bold">{roadmapCompletion}%</div>
            <p className="text-sm text-muted-foreground">Overall Progress</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-blue-500 text-3xl font-bold">{performanceGoals.length}</div>
            <p className="text-sm text-muted-foreground">Active Goals</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-purple-500 text-3xl font-bold">Q3</div>
            <p className="text-sm text-muted-foreground">Current Period</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          {isAdmin && <TabsTrigger value="settings">Settings</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Performance Goals</CardTitle>
                <CardDescription>
                  Track and manage goal progress for this quarter
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <PerformanceGoalTable goals={performanceGoals} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rankings" className="space-y-4">
          <PerformanceRankingsDashboard />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <PerformanceTrendsChart />
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
                <CardDescription>Employee rating distribution by department</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p>Distribution charts will appear here</p>
                  <p className="text-sm">Coming soon in the next update</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Settings</CardTitle>
                <CardDescription>Configure performance metrics and review cycles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Review Cycles</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your organization's review cycles and timing
                      </p>
                      <Button variant="outline" size="sm">Manage Cycles</Button>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Goal Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure goal types, weights, and approval flows
                      </p>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Reporting</h3>
                      <p className="text-sm text-muted-foreground">
                        Set up automated reports and export settings
                      </p>
                      <Button variant="outline" size="sm">Manage Reports</Button>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Permissions</h3>
                      <p className="text-sm text-muted-foreground">
                        Control who can view and manage performance data
                      </p>
                      <Button variant="outline" size="sm">Set Permissions</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
