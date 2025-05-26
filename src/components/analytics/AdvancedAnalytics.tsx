
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useClerkAuth } from '@/context/ClerkAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsData {
  performanceTrends: any[];
  skillDistribution: any[];
  goalCompletion: any[];
  feedbackMetrics: any[];
}

export default function AdvancedAnalytics() {
  const { user } = useClerkAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    performanceTrends: [],
    skillDistribution: [],
    goalCompletion: [],
    feedbackMetrics: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('quarter');

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        // Fetch performance trends
        const { data: trends } = await supabase
          .from('performance_trends')
          .select('*')
          .eq('user_id', user.id)
          .order('period_start', { ascending: true });

        // Fetch skill assessments for distribution
        const { data: skills } = await supabase
          .from('skill_assessments')
          .select('skill_id, competency_level, skills(name)')
          .eq('user_id', user.id);

        // Fetch goal completion data
        const { data: goals } = await supabase
          .from('goals')
          .select('status, progress, created_at')
          .eq('user_id', user.id);

        // Fetch feedback metrics
        const { data: feedback } = await supabase
          .from('feedback')
          .select('type, created_at')
          .eq('recipient_id', user.id);

        // Process data for charts
        const processedTrends = trends?.map(t => ({
          period: new Date(t.period_start).toLocaleDateString(),
          score: t.overall_score || 0,
          goalCompletion: t.goal_completion_rate || 0
        })) || [];

        const skillDistribution = skills?.reduce((acc: any[], skill: any) => {
          const existingSkill = acc.find(s => s.name === skill.skills?.name);
          if (existingSkill) {
            existingSkill.level = Math.max(existingSkill.level, skill.competency_level);
          } else {
            acc.push({
              name: skill.skills?.name || 'Unknown',
              level: skill.competency_level
            });
          }
          return acc;
        }, []) || [];

        const goalCompletion = goals?.reduce((acc: any, goal: any) => {
          const status = goal.status;
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const goalCompletionData = Object.entries(goalCompletion || {}).map(([status, count]) => ({
          status,
          count,
          percentage: Math.round((count as number) / (goals?.length || 1) * 100)
        }));

        setAnalyticsData({
          performanceTrends: processedTrends,
          skillDistribution,
          goalCompletion: goalCompletionData,
          feedbackMetrics: feedback || []
        });

      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, timeframe]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Advanced Analytics</h2>
        <div className="flex gap-2">
          {(['month', 'quarter', 'year'] as const).map((period) => (
            <Badge
              key={period}
              variant={timeframe === period ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setTimeframe(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance Trends</TabsTrigger>
          <TabsTrigger value="skills">Skill Distribution</TabsTrigger>
          <TabsTrigger value="goals">Goal Analytics</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
              <CardDescription>Track your performance scores and goal completion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.performanceTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#8884d8" name="Performance Score" />
                  <Line type="monotone" dataKey="goalCompletion" stroke="#82ca9d" name="Goal Completion %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skill Competency Levels</CardTitle>
              <CardDescription>Your current skill ratings across different areas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.skillDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="level" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Goal Completion Distribution</CardTitle>
              <CardDescription>Breakdown of your goals by status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.goalCompletion}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, percentage }) => `${status}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analyticsData.goalCompletion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Overview</CardTitle>
              <CardDescription>Summary of feedback received over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {analyticsData.feedbackMetrics.filter(f => f.type === 'positive').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Positive Feedback</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {analyticsData.feedbackMetrics.filter(f => f.type === 'constructive').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Constructive Feedback</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {analyticsData.feedbackMetrics.filter(f => f.type === 'general').length}
                  </div>
                  <div className="text-sm text-muted-foreground">General Feedback</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
