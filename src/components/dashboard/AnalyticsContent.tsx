
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsContentProps {
  userRole: string;
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  handleTimeframeChange: (timeframe: 'week' | 'month' | 'quarter' | 'year') => void;
}

export default function AnalyticsContent({ 
  userRole, 
  timeframe, 
  handleTimeframeChange 
}: AnalyticsContentProps) {
  // For admin or manager, show the analytics dashboard
  if (userRole === 'admin' || userRole === 'manager') {
    return (
      <AnalyticsDashboard 
        timeframe={timeframe} 
        onTimeframeChange={handleTimeframeChange} 
      />
    );
  }
  
  // For other roles, show a placeholder
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trends</CardTitle>
        <CardDescription>Your performance data over time</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">
          Historical performance data will be shown here in future versions.
        </p>
      </CardContent>
    </Card>
  );
}
