
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PerformanceBenchmarkChart from './PerformanceBenchmarkChart';
import PerformanceTrendsChart from './PerformanceTrendsChart';
import TimeframeSelector from './TimeframeSelector';

interface PerformanceBenchmarkingDashboardProps {
  timeframe: "week" | "month" | "quarter" | "year";
}

export default function PerformanceBenchmarkingDashboard({ timeframe }: PerformanceBenchmarkingDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Performance Metrics</h3>
        <TimeframeSelector />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>
              How each department compares to company average
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceBenchmarkChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>
              Average performance score evolution over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceTrendsChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
