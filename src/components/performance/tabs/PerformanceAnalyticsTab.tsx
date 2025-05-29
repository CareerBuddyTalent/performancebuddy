
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdvancedAnalyticsDashboard } from "@/components/analytics/AdvancedAnalyticsDashboard";

export default function PerformanceAnalyticsTab() {
  return (
    <div className="space-y-6">
      <AdvancedAnalyticsDashboard />
    </div>
  );
}
