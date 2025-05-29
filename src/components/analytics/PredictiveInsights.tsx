
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertTriangle, Target } from "lucide-react";

interface PredictiveInsight {
  id: string;
  type: 'performance' | 'retention' | 'growth' | 'risk';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'stable';
  value: string;
  recommendation: string;
}

const mockInsights: PredictiveInsight[] = [
  {
    id: '1',
    type: 'performance',
    title: 'Performance Trajectory',
    description: 'Based on current trends, performance is likely to improve by 15% next quarter',
    confidence: 85,
    impact: 'high',
    trend: 'up',
    value: '+15%',
    recommendation: 'Continue current development initiatives'
  },
  {
    id: '2',
    type: 'retention',
    title: 'Retention Risk',
    description: '3 team members show signs of disengagement',
    confidence: 72,
    impact: 'medium',
    trend: 'down',
    value: '3 at risk',
    recommendation: 'Schedule 1:1 meetings and review workload'
  },
  {
    id: '3',
    type: 'growth',
    title: 'Skill Development',
    description: 'Team is ready for advanced technical challenges',
    confidence: 91,
    impact: 'high',
    trend: 'up',
    value: '91% ready',
    recommendation: 'Introduce stretch assignments and certifications'
  }
];

export function PredictiveInsights() {
  const getInsightIcon = (type: string, trend: string) => {
    if (type === 'risk') return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    if (trend === 'up') return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <Target className="h-5 w-5 text-blue-500" />;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Insights</CardTitle>
        <CardDescription>
          Predictive analytics and recommendations based on performance data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockInsights.map((insight) => (
          <div key={insight.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getInsightIcon(insight.type, insight.trend)}
                <div>
                  <h4 className="font-medium">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getImpactColor(insight.impact) as any}>
                  {insight.impact} impact
                </Badge>
                <span className="text-lg font-bold">{insight.value}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Confidence Level</span>
                <span>{insight.confidence}%</span>
              </div>
              <Progress value={insight.confidence} className="h-2" />
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm font-medium text-blue-900 mb-1">Recommendation:</p>
              <p className="text-sm text-blue-700">{insight.recommendation}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
