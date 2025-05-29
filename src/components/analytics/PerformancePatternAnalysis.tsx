
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Calendar,
  Users,
  BarChart3
} from 'lucide-react';

interface PerformancePattern {
  id: string;
  pattern: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  trend: 'positive' | 'negative' | 'neutral';
  recommendation: string;
  affectedMetrics: string[];
}

interface SeasonalTrend {
  period: string;
  description: string;
  strength: number;
  predictability: number;
}

const mockPatterns: PerformancePattern[] = [
  {
    id: '1',
    pattern: 'Monday Performance Dip',
    description: 'Consistent 15% decrease in performance on Mondays',
    confidence: 87,
    impact: 'medium',
    trend: 'negative',
    recommendation: 'Consider Monday morning team check-ins or reduced workload',
    affectedMetrics: ['Sales Calls', 'Customer Response Time']
  },
  {
    id: '2',
    pattern: 'Month-End Sprint',
    description: 'Performance increases 25% in the last week of each month',
    confidence: 92,
    impact: 'high',
    trend: 'positive',
    recommendation: 'Leverage this pattern for critical deliverables',
    affectedMetrics: ['Code Reviews', 'Project Completion']
  },
  {
    id: '3',
    pattern: 'Collaboration Boost',
    description: 'Team performance improves when remote workers are in office',
    confidence: 78,
    impact: 'medium',
    trend: 'positive',
    recommendation: 'Schedule important meetings on in-office days',
    affectedMetrics: ['Meeting Effectiveness', 'Decision Speed']
  }
];

const mockSeasonalTrends: SeasonalTrend[] = [
  {
    period: 'Q4 Peak',
    description: 'Performance typically increases 20% in Q4',
    strength: 85,
    predictability: 92
  },
  {
    period: 'Summer Lull',
    description: 'Slight decrease in June-August due to vacations',
    strength: 68,
    predictability: 75
  },
  {
    period: 'New Year Ramp',
    description: 'January shows gradual improvement throughout month',
    strength: 72,
    predictability: 88
  }
];

export function PerformancePatternAnalysis() {
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="h-6 w-6" />
          Performance Pattern Analysis
        </h2>
        <p className="text-muted-foreground">
          AI-powered insights into performance patterns and trends
        </p>
      </div>

      <Tabs defaultValue="patterns" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="patterns">Detected Patterns</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal Trends</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockPatterns.map((pattern) => (
              <Card 
                key={pattern.id}
                className={`cursor-pointer transition-all ${
                  selectedPattern === pattern.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedPattern(
                  selectedPattern === pattern.id ? null : pattern.id
                )}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pattern.pattern}</CardTitle>
                    <Badge className={getImpactColor(pattern.impact)}>
                      {pattern.impact}
                    </Badge>
                  </div>
                  <CardDescription>{pattern.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Confidence</span>
                        <span className="text-sm text-muted-foreground">
                          {pattern.confidence}%
                        </span>
                      </div>
                      <Progress value={pattern.confidence} className="h-2" />
                    </div>

                    <div className="flex items-center gap-2">
                      <TrendingUp className={`h-4 w-4 ${getTrendColor(pattern.trend)}`} />
                      <span className={`text-sm ${getTrendColor(pattern.trend)}`}>
                        {pattern.trend} impact
                      </span>
                    </div>

                    {selectedPattern === pattern.id && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-2">Recommendation:</p>
                        <p className="text-sm text-muted-foreground">
                          {pattern.recommendation}
                        </p>
                        
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-1">Affected Metrics:</p>
                          <div className="flex flex-wrap gap-1">
                            {pattern.affectedMetrics.map((metric, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {metric}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockSeasonalTrends.map((trend, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {trend.period}
                  </CardTitle>
                  <CardDescription>{trend.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Strength</span>
                        <span className="text-sm text-muted-foreground">
                          {trend.strength}%
                        </span>
                      </div>
                      <Progress value={trend.strength} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Predictability</span>
                        <span className="text-sm text-muted-foreground">
                          {trend.predictability}%
                        </span>
                      </div>
                      <Progress value={trend.predictability} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Predictions
              </CardTitle>
              <CardDescription>
                AI-generated predictions based on historical patterns
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Next Week Forecast</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Based on historical data and current trends
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">+12%</p>
                      <p className="text-xs text-muted-foreground">Sales Calls</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">+8%</p>
                      <p className="text-xs text-muted-foreground">Code Reviews</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">-3%</p>
                      <p className="text-xs text-muted-foreground">Response Time</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">+15%</p>
                      <p className="text-xs text-muted-foreground">Collaboration</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <h4 className="font-medium">Potential Risks</h4>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Team productivity may decrease due to upcoming holiday</li>
                    <li>• Customer support load expected to increase by 20%</li>
                    <li>• Development velocity might slow due to pending reviews</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
