
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileBarChart, Download, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNotifications } from "@/hooks/use-notifications";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const isMobile = useIsMobile();
  const { addNotification } = useNotifications();
  
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
  
  // For admin or manager, show the analytics dashboard
  if (userRole === 'admin' || userRole === 'manager') {
    return (
      <Card className="shadow-md border-t-4 border-t-purple-500 dark:border-t-purple-400 hover:shadow-lg transition-shadow">
        <CardHeader className={`${isMobile ? 'p-4' : 'pb-0'} flex flex-col sm:flex-row sm:items-center sm:justify-between`}>
          <div>
            <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Performance Analytics</CardTitle>
            <CardDescription className="text-gray-500">Detailed team performance metrics and trends</CardDescription>
          </div>
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Download className="h-3.5 w-3.5" />
                  Export
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')}>
                  Export as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className={`${isMobile ? 'p-4 pt-2' : 'pt-4'}`}>
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
      <CardHeader className={isMobile ? 'p-4' : ''}>
        <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Performance Trends</CardTitle>
        <CardDescription className="text-gray-500">Your performance data over time</CardDescription>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-4 pt-0' : ''} h-[250px] sm:h-[300px] flex flex-col items-center justify-center`}>
        <FileBarChart className="h-12 w-12 sm:h-16 sm:w-16 text-blue-200 dark:text-blue-800 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md px-2">
          Historical performance data visualization will be available in future versions.
          <br /> 
          <span className="text-sm mt-2 block">Check back soon for personalized insights and trend analysis.</span>
        </p>
      </CardContent>
    </Card>
  );
}
