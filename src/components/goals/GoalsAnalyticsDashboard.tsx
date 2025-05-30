
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Goal } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import { Target, CheckCircle2, Clock, TrendingUp } from 'lucide-react';

interface GoalsAnalyticsDashboardProps {
  goals: Goal[];
}

export default function GoalsAnalyticsDashboard({ goals }: GoalsAnalyticsDashboardProps) {
  // Calculate goals by status
  const goalsByStatus = [
    { name: 'Completed', value: goals.filter(g => g.status === 'completed').length, color: '#22c55e' },
    { name: 'In Progress', value: goals.filter(g => g.status === 'in_progress').length, color: '#f59e0b' },
    { name: 'Not Started', value: goals.filter(g => g.status === 'not_started').length, color: '#6b7280' }
  ];

  // Calculate check-in status (goals updated in last 7 days)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentlyUpdated = goals.filter(goal => new Date(goal.updatedAt) > sevenDaysAgo).length;
  const checkInPercentage = goals.length > 0 ? Math.round((recentlyUpdated / goals.length) * 100) : 0;

  // Calculate average progress
  const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0);
  const averageProgress = goals.length > 0 ? Math.round(totalProgress / goals.length) : 0;

  // Progress trend data (mock data for demonstration)
  const progressTrend = [
    { month: 'Jan', progress: 20 },
    { month: 'Feb', progress: 35 },
    { month: 'Mar', progress: 45 },
    { month: 'Apr', progress: averageProgress }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Goals by Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Goals by Status
          </CardTitle>
          <CardDescription>Distribution of your goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={goalsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={40}
                    dataKey="value"
                  >
                    {goalsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {goalsByStatus.map((status, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-muted-foreground">{status.name}</span>
                  <Badge variant="outline" className="ml-auto">
                    {status.value}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Check-in Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Check-in Status
          </CardTitle>
          <CardDescription>Goals updated this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{checkInPercentage}%</div>
              <p className="text-sm text-muted-foreground">of goals checked in</p>
            </div>
            <Progress value={checkInPercentage} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{recentlyUpdated} updated</span>
              <span>{goals.length - recentlyUpdated} need attention</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Average Progress
          </CardTitle>
          <CardDescription>Progress trend over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{averageProgress}%</div>
              <p className="text-sm text-muted-foreground">average completion</p>
            </div>
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressTrend}>
                  <Line 
                    type="monotone" 
                    dataKey="progress" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                  />
                  <XAxis dataKey="month" hide />
                  <YAxis hide />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
