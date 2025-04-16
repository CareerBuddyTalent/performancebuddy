
import PerformanceTrendsChart from "./analytics/PerformanceTrendsChart";
import SkillDistributionChart from "./analytics/SkillDistributionChart";
import EngagementScoresChart from "./analytics/EngagementScoresChart";
import AiInsights from "./analytics/AiInsights";
import TimeframeSelector from "./analytics/TimeframeSelector";

interface AnalyticsDashboardProps {
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  onTimeframeChange: (timeframe: 'week' | 'month' | 'quarter' | 'year') => void;
}

export default function AnalyticsDashboard({ timeframe, onTimeframeChange }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">Performance Analytics</h2>
          <p className="text-muted-foreground">AI-powered insights from your organization's data</p>
        </div>
        <TimeframeSelector timeframe={timeframe} onTimeframeChange={onTimeframeChange} />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <PerformanceTrendsChart />
        <SkillDistributionChart />
        <EngagementScoresChart />
      </div>
      
      <AiInsights />
    </div>
  );
}
