
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PerformanceBenchmarkChart from './PerformanceBenchmarkChart';
import PerformanceTrendsChart from './PerformanceTrendsChart';
import TimeframeSelector from './TimeframeSelector';

interface PerformanceBenchmarkingDashboardProps {
  timeframe: "week" | "month" | "quarter" | "year";
}

// Sample benchmark data
const benchmarkData = [
  { name: 'Engineering', value: 85, benchmark: 80, industryAverage: 75, teamTarget: 90 },
  { name: 'Sales', value: 72, benchmark: 68, industryAverage: 70, teamTarget: 75 },
  { name: 'Marketing', value: 78, benchmark: 75, industryAverage: 72, teamTarget: 80 },
  { name: 'Customer Support', value: 81, benchmark: 76, industryAverage: 73, teamTarget: 85 },
  { name: 'Product', value: 79, benchmark: 77, industryAverage: 74, teamTarget: 82 },
];

export default function PerformanceBenchmarkingDashboard({ timeframe }: PerformanceBenchmarkingDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"week" | "month" | "quarter" | "year">(timeframe);
  
  const handleTimeframeChange = (newTimeframe: "week" | "month" | "quarter" | "year") => {
    setSelectedTimeframe(newTimeframe);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Performance Metrics</h3>
        <TimeframeSelector 
          timeframe={selectedTimeframe} 
          onTimeframeChange={handleTimeframeChange} 
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <PerformanceBenchmarkChart 
          title="Department Performance"
          description="How each department compares to company average"
          timeframe={selectedTimeframe}
          data={benchmarkData}
        />
        
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
