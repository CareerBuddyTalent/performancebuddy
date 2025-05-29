
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeSeriesChart } from '@/components/analytics/TimeSeriesChart';
import { PerformancePatternAnalysis } from '@/components/analytics/PerformancePatternAnalysis';
import { TeamPerformanceLeaderboard } from '@/components/analytics/TeamPerformanceLeaderboard';
import { TeamGoalCascading } from '@/components/analytics/TeamGoalCascading';
import { BarChart3, Brain, Trophy, TreePine } from 'lucide-react';

// Mock time-series data with proper typing
const mockTimeSeriesData = [
  { date: '2024-01-01', value: 85, baseline: 80, target: 95, trend: 'up' as const },
  { date: '2024-01-02', value: 87, baseline: 80, target: 95, trend: 'up' as const },
  { date: '2024-01-03', value: 82, baseline: 80, target: 95, trend: 'down' as const },
  { date: '2024-01-04', value: 89, baseline: 80, target: 95, trend: 'up' as const },
  { date: '2024-01-05', value: 91, baseline: 80, target: 95, trend: 'up' as const },
  { date: '2024-01-06', value: 88, baseline: 80, target: 95, trend: 'down' as const },
  { date: '2024-01-07', value: 93, baseline: 80, target: 95, trend: 'up' as const },
];

export function AdvancedAnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Advanced Analytics</h2>
        <p className="text-muted-foreground">
          Deep insights into performance patterns, trends, and team dynamics
        </p>
      </div>

      <Tabs defaultValue="time-series" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="time-series" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Time Series
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Pattern Analysis
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="cascading" className="flex items-center gap-2">
            <TreePine className="h-4 w-4" />
            Goal Cascading
          </TabsTrigger>
        </TabsList>

        <TabsContent value="time-series" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TimeSeriesChart
              title="Sales Performance"
              description="Daily sales call effectiveness"
              data={mockTimeSeriesData}
              metric="Sales Calls"
              unit="%"
              frequency="daily"
            />
            
            <TimeSeriesChart
              title="Code Review Velocity"
              description="Weekly code review completion rate"
              data={mockTimeSeriesData.map(d => ({
                ...d,
                value: d.value - 10,
                baseline: d.baseline - 10,
                target: d.target - 10,
                trend: d.trend
              }))}
              metric="Code Reviews"
              unit=" reviews"
              frequency="weekly"
            />
            
            <TimeSeriesChart
              title="Customer Satisfaction"
              description="Monthly customer satisfaction scores"
              data={mockTimeSeriesData.map(d => ({
                ...d,
                value: d.value + 5,
                baseline: d.baseline + 5,
                target: d.target + 5,
                trend: d.trend
              }))}
              metric="CSAT Score"
              unit="%"
              frequency="monthly"
            />
            
            <TimeSeriesChart
              title="Goal Completion Rate"
              description="Overall goal completion tracking"
              data={mockTimeSeriesData.map(d => ({
                ...d,
                value: d.value - 5,
                baseline: d.baseline - 5,
                target: d.target - 5,
                trend: d.trend
              }))}
              metric="Completion Rate"
              unit="%"
              frequency="weekly"
            />
          </div>
        </TabsContent>

        <TabsContent value="patterns">
          <PerformancePatternAnalysis />
        </TabsContent>

        <TabsContent value="leaderboard">
          <TeamPerformanceLeaderboard />
        </TabsContent>

        <TabsContent value="cascading">
          <TeamGoalCascading />
        </TabsContent>
      </Tabs>
    </div>
  );
}
