
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PerformanceTrendsChart from "@/components/analytics/PerformanceTrendsChart";

export default function PerformanceAnalyticsTab() {
  return (
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
  );
}
