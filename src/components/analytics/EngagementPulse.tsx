
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Users, MessageSquare, Target, Clock } from "lucide-react";

interface EngagementMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  trend: 'up' | 'down' | 'stable';
  category: 'participation' | 'satisfaction' | 'productivity' | 'feedback';
  icon: React.ReactNode;
}

const mockEngagementData: EngagementMetric[] = [
  {
    id: '1',
    name: 'Review Participation',
    value: 87,
    previousValue: 82,
    trend: 'up',
    category: 'participation',
    icon: <Users className="h-4 w-4" />
  },
  {
    id: '2',
    name: 'Feedback Quality Score',
    value: 74,
    previousValue: 78,
    trend: 'down',
    category: 'feedback',
    icon: <MessageSquare className="h-4 w-4" />
  },
  {
    id: '3',
    name: 'Goal Completion Rate',
    value: 92,
    previousValue: 88,
    trend: 'up',
    category: 'productivity',
    icon: <Target className="h-4 w-4" />
  },
  {
    id: '4',
    name: 'Response Timeliness',
    value: 68,
    previousValue: 68,
    trend: 'stable',
    category: 'participation',
    icon: <Clock className="h-4 w-4" />
  }
];

export function EngagementPulse() {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'participation': return 'bg-blue-100 text-blue-800';
      case 'satisfaction': return 'bg-green-100 text-green-800';
      case 'productivity': return 'bg-purple-100 text-purple-800';
      case 'feedback': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateChange = (current: number, previous: number) => {
    return Math.abs(((current - previous) / previous) * 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Pulse</CardTitle>
        <CardDescription>
          Real-time engagement metrics across the organization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockEngagementData.map((metric) => (
            <div key={metric.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {metric.icon}
                  <span className="font-medium">{metric.name}</span>
                </div>
                <Badge className={getCategoryColor(metric.category)}>
                  {metric.category}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{metric.value}%</span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(metric.trend)}
                    <span className={`text-sm ${getTrendColor(metric.trend)}`}>
                      {metric.trend !== 'stable' ? `${calculateChange(metric.value, metric.previousValue).toFixed(1)}%` : '0%'}
                    </span>
                  </div>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
              
              <p className="text-xs text-muted-foreground">
                Previous period: {metric.previousValue}%
              </p>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Engagement Insights</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Overall engagement is trending upward with 5% improvement</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-orange-500" />
              <span>Feedback quality needs attention - consider training sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-500" />
              <span>Goal completion rates are exceeding targets across teams</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
