
import { useState } from "react";
import { useAsync, useThrottle } from "react-use";
import PerformanceTrendsChart from "./PerformanceTrendsChart";
import LazySkillDistributionChart from "./LazySkillDistributionChart";
import LazyEngagementScoresChart from "./LazyEngagementScoresChart";
import AiInsights from "./AiInsights";
import TimeframeSelector from "./TimeframeSelector";
import PerformanceRankingsDashboard from "../performance/PerformanceRankingsDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface EnhancedAnalyticsDashboardProps {
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  onTimeframeChange: (timeframe: 'week' | 'month' | 'quarter' | 'year') => void;
}

// Mock API function for analytics data
const fetchAnalyticsData = async (timeframe: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    performanceData: [],
    skillsData: [],
    engagementData: [],
    timeframe
  };
};

export default function EnhancedAnalyticsDashboard({ timeframe, onTimeframeChange }: EnhancedAnalyticsDashboardProps) {
  const [performanceView, setPerformanceView] = useState<'all' | 'department' | 'cycle'>('all');
  
  // Use throttled timeframe changes to prevent excessive API calls
  const throttledTimeframe = useThrottle(timeframe, 500);
  
  // Use async hook for data fetching
  const analyticsState = useAsync(
    () => fetchAnalyticsData(throttledTimeframe),
    [throttledTimeframe]
  );

  if (analyticsState.loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (analyticsState.error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load analytics data</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm text-muted-foreground underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">Performance Analytics</h2>
          <p className="text-muted-foreground">AI-powered insights from your organization's data</p>
        </div>
        <TimeframeSelector timeframe={timeframe} onTimeframeChange={onTimeframeChange} />
      </div>
      
      <Tabs defaultValue="rankings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rankings">Performance Rankings</TabsTrigger>
          <TabsTrigger value="charts">Performance Charts</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rankings">
          <PerformanceRankingsDashboard />
        </TabsContent>
        
        <TabsContent value="charts">
          <div className="grid gap-4 md:grid-cols-2">
            <PerformanceTrendsChart />
            <LazySkillDistributionChart />
            <LazyEngagementScoresChart />
          </div>
        </TabsContent>
        
        <TabsContent value="insights">
          <AiInsights />
        </TabsContent>
      </Tabs>
    </div>
  );
}
