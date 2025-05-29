
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, Calendar, Award } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PerformanceMetric {
  label: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

const mockMetrics: PerformanceMetric[] = [
  {
    label: "Goals Completed",
    value: 8,
    target: 12,
    trend: 'up',
    color: 'bg-green-500'
  },
  {
    label: "Peer Reviews",
    value: 5,
    target: 6,
    trend: 'up',
    color: 'bg-blue-500'
  },
  {
    label: "Skills Developed",
    value: 3,
    target: 5,
    trend: 'stable',
    color: 'bg-purple-500'
  },
  {
    label: "Feedback Score",
    value: 4.2,
    target: 5.0,
    trend: 'up',
    color: 'bg-orange-500'
  }
];

export function MobilePerformanceWidget() {
  const isMobile = useIsMobile();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down':
        return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
      default:
        return <div className="h-3 w-3 rounded-full bg-gray-400" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className={`${isMobile ? 'pb-3' : 'pb-4'}`}>
        <div className="flex items-center justify-between">
          <CardTitle className={`${isMobile ? 'text-base' : 'text-lg'} flex items-center gap-2`}>
            <Award className="h-5 w-5 text-primary" />
            Performance Overview
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            This Quarter
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {mockMetrics.map((metric, index) => {
          const percentage = (metric.value / metric.target) * 100;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${metric.color}`} />
                  <span className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium`}>
                    {metric.label}
                  </span>
                  {getTrendIcon(metric.trend)}
                </div>
                <span className={`${isMobile ? 'text-sm' : 'text-sm'} text-muted-foreground`}>
                  {metric.value}/{metric.target}
                </span>
              </div>
              
              <Progress 
                value={percentage} 
                className="h-2" 
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{Math.round(percentage)}% complete</span>
                <span>
                  {metric.target - metric.value > 0 
                    ? `${metric.target - metric.value} remaining`
                    : 'Target achieved!'
                  }
                </span>
              </div>
            </div>
          );
        })}
        
        {/* Quick actions for mobile */}
        {isMobile && (
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-2">
              <button className="p-2 text-xs bg-primary/10 text-primary rounded-lg flex items-center justify-center gap-1 hover:bg-primary/20 transition-colors">
                <Target className="h-3 w-3" />
                Set Goals
              </button>
              <button className="p-2 text-xs bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center gap-1 hover:bg-blue-100 transition-colors">
                <Calendar className="h-3 w-3" />
                Schedule 1:1
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
