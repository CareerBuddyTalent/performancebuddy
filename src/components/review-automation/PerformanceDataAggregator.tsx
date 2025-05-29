
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Target, Calendar, FileText, Download } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval } from 'date-fns';

interface AggregatedMetric {
  id: string;
  name: string;
  category: 'kpi' | 'goal' | 'feedback' | 'skill';
  value: number;
  target?: number;
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
  unit: string;
  lastUpdated: Date;
  historicalData: { date: string; value: number }[];
}

interface PerformanceSummary {
  userId: string;
  userName: string;
  period: { start: Date; end: Date };
  overallScore: number;
  metrics: AggregatedMetric[];
  goals: {
    completed: number;
    total: number;
    onTrack: number;
    behindSchedule: number;
  };
  feedback: {
    positive: number;
    constructive: number;
    totalReceived: number;
  };
  kpiTrends: {
    improving: number;
    declining: number;
    stable: number;
  };
}

const mockPerformanceSummaries: PerformanceSummary[] = [
  {
    userId: '1',
    userName: 'Sarah Johnson',
    period: { start: new Date('2024-10-01'), end: new Date('2024-12-31') },
    overallScore: 4.2,
    metrics: [
      {
        id: '1',
        name: 'Sales Targets',
        category: 'kpi',
        value: 125000,
        target: 100000,
        trend: 'up',
        changePercentage: 15.5,
        unit: '$',
        lastUpdated: new Date('2024-12-15'),
        historicalData: [
          { date: '2024-10', value: 95000 },
          { date: '2024-11', value: 110000 },
          { date: '2024-12', value: 125000 }
        ]
      },
      {
        id: '2',
        name: 'Customer Satisfaction',
        category: 'kpi',
        value: 4.7,
        target: 4.5,
        trend: 'up',
        changePercentage: 8.2,
        unit: '/5',
        lastUpdated: new Date('2024-12-15'),
        historicalData: [
          { date: '2024-10', value: 4.3 },
          { date: '2024-11', value: 4.5 },
          { date: '2024-12', value: 4.7 }
        ]
      }
    ],
    goals: {
      completed: 8,
      total: 12,
      onTrack: 3,
      behindSchedule: 1
    },
    feedback: {
      positive: 12,
      constructive: 3,
      totalReceived: 15
    },
    kpiTrends: {
      improving: 6,
      declining: 1,
      stable: 2
    }
  }
];

export function PerformanceDataAggregator() {
  const [selectedPeriod, setSelectedPeriod] = useState('quarter');
  const [selectedUser, setSelectedUser] = useState('all');
  const [summaries] = useState<PerformanceSummary[]>(mockPerformanceSummaries);

  const formatMetricValue = (metric: AggregatedMetric) => {
    if (metric.unit === '$') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(metric.value);
    }
    return `${metric.value}${metric.unit}`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 4.5) return { label: 'Exceeds Expectations', color: 'bg-green-100 text-green-800' };
    if (score >= 3.5) return { label: 'Meets Expectations', color: 'bg-blue-100 text-blue-800' };
    if (score >= 2.5) return { label: 'Below Expectations', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };

  const generateAutomatedSummary = (summary: PerformanceSummary) => {
    const performance = getPerformanceLevel(summary.overallScore);
    const goalCompletion = (summary.goals.completed / summary.goals.total) * 100;
    const improvingKPIs = summary.kpiTrends.improving;
    
    return `${summary.userName} demonstrates ${performance.label.toLowerCase()} with an overall score of ${summary.overallScore}/5. 
    They have completed ${summary.goals.completed} of ${summary.goals.total} goals (${Math.round(goalCompletion)}%) and show 
    improvement in ${improvingKPIs} key performance indicators. Recent feedback includes ${summary.feedback.positive} 
    positive and ${summary.feedback.constructive} constructive comments.`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Performance Data Aggregation</h2>
          <p className="text-muted-foreground">
            Automated collection and analysis of performance data for comprehensive reviews
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {summaries.map((summary) => (
          <Card key={summary.userId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{summary.userName}</CardTitle>
                  <CardDescription>
                    Performance Summary: {format(summary.period.start, 'PPP')} - {format(summary.period.end, 'PPP')}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-2xl font-bold">{summary.overallScore}/5</div>
                    <Badge className={getPerformanceLevel(summary.overallScore).color}>
                      {getPerformanceLevel(summary.overallScore).label}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="kpis">KPIs & Metrics</TabsTrigger>
                  <TabsTrigger value="goals">Goals</TabsTrigger>
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                  <TabsTrigger value="summary">AI Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Goal Completion</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {Math.round((summary.goals.completed / summary.goals.total) * 100)}%
                        </div>
                        <Progress 
                          value={(summary.goals.completed / summary.goals.total) * 100} 
                          className="mt-2" 
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {summary.goals.completed} of {summary.goals.total} completed
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">KPI Trends</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-green-600">Improving:</span>
                            <span>{summary.kpiTrends.improving}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-red-600">Declining:</span>
                            <span>{summary.kpiTrends.declining}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Stable:</span>
                            <span>{summary.kpiTrends.stable}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Feedback Received</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{summary.feedback.totalReceived}</div>
                        <div className="space-y-1 mt-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-green-600">Positive:</span>
                            <span>{summary.feedback.positive}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-600">Constructive:</span>
                            <span>{summary.feedback.constructive}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="kpis" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {summary.metrics.map((metric) => (
                      <Card key={metric.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{metric.name}</CardTitle>
                            {getTrendIcon(metric.trend)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-2xl font-bold">
                                {formatMetricValue(metric)}
                              </span>
                              <Badge variant={metric.trend === 'up' ? 'default' : 'destructive'}>
                                {metric.changePercentage > 0 ? '+' : ''}{metric.changePercentage}%
                              </Badge>
                            </div>
                            {metric.target && (
                              <div className="text-sm text-muted-foreground">
                                Target: {formatMetricValue({...metric, value: metric.target})}
                              </div>
                            )}
                            <ResponsiveContainer width="100%" height={60}>
                              <LineChart data={metric.historicalData}>
                                <Line 
                                  type="monotone" 
                                  dataKey="value" 
                                  stroke="#2563eb" 
                                  strokeWidth={2}
                                  dot={false}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="goals" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Goal Progress Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={[
                            { name: 'Completed', value: summary.goals.completed, fill: '#22c55e' },
                            { name: 'On Track', value: summary.goals.onTrack, fill: '#3b82f6' },
                            { name: 'Behind', value: summary.goals.behindSchedule, fill: '#ef4444' }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Goal Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span>Total Goals</span>
                            <Badge variant="outline">{summary.goals.total}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Completed</span>
                            <Badge className="bg-green-100 text-green-800">{summary.goals.completed}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>On Track</span>
                            <Badge className="bg-blue-100 text-blue-800">{summary.goals.onTrack}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Behind Schedule</span>
                            <Badge className="bg-red-100 text-red-800">{summary.goals.behindSchedule}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="feedback" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Feedback Analysis</CardTitle>
                      <CardDescription>
                        Summary of feedback received during the review period
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600">{summary.feedback.positive}</div>
                          <p className="text-sm text-muted-foreground">Positive Feedback</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">{summary.feedback.constructive}</div>
                          <p className="text-sm text-muted-foreground">Constructive Feedback</p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold">{summary.feedback.totalReceived}</div>
                          <p className="text-sm text-muted-foreground">Total Received</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="summary" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        AI-Generated Performance Summary
                      </CardTitle>
                      <CardDescription>
                        Automated analysis and summary of performance data
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <p className="text-sm leading-relaxed">
                          {generateAutomatedSummary(summary)}
                        </p>
                      </div>
                      
                      <div className="mt-6 p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">Key Recommendations:</h4>
                        <ul className="text-sm space-y-1 list-disc list-inside">
                          <li>Continue focus on customer satisfaction initiatives</li>
                          <li>Accelerate progress on remaining quarterly goals</li>
                          <li>Leverage strengths in sales performance for team mentoring</li>
                          <li>Address areas identified in constructive feedback</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
