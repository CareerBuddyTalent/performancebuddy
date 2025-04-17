
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileBarChart } from "lucide-react";

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
      <Card className="shadow-md border-t-4 border-t-purple-500 dark:border-t-purple-400 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Performance Analytics</CardTitle>
          <CardDescription className="text-gray-500">Detailed team performance metrics and trends</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <AnalyticsDashboard 
            timeframe={timeframe} 
            onTimeframeChange={handleTimeframeChange} 
          />
        </CardContent>
      </Card>
    );
  }
  
  // For other roles, show a placeholder
  return (
    <Card className="shadow-md border-t-4 border-t-blue-500 dark:border-t-blue-400 hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Performance Trends</CardTitle>
        <CardDescription className="text-gray-500">Your performance data over time</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px] flex flex-col items-center justify-center">
        <FileBarChart className="h-16 w-16 text-blue-200 dark:text-blue-800 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          Historical performance data visualization will be available in future versions.
          <br /> 
          <span className="text-sm mt-2 block">Check back soon for personalized insights and trend analysis.</span>
        </p>
      </CardContent>
    </Card>
  );
}
