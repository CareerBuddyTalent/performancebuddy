
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, MessageSquare, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const engagementData = [
  { month: 'Jan', score: 7.2, participation: 85 },
  { month: 'Feb', score: 7.5, participation: 88 },
  { month: 'Mar', score: 7.1, participation: 82 },
  { month: 'Apr', score: 7.8, participation: 91 },
  { month: 'May', score: 8.2, participation: 94 },
  { month: 'Jun', score: 8.0, participation: 89 }
];

const pulseMetrics = [
  { label: 'Overall Satisfaction', score: 8.2, trend: '+0.3', color: 'text-green-600' },
  { label: 'Work-Life Balance', score: 7.8, trend: '+0.1', color: 'text-green-600' },
  { label: 'Career Growth', score: 7.5, trend: '-0.2', color: 'text-red-600' },
  { label: 'Team Collaboration', score: 8.5, trend: '+0.5', color: 'text-green-600' }
];

export function EngagementPulse() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Engagement Pulse
              </CardTitle>
              <CardDescription>Real-time team engagement metrics</CardDescription>
            </div>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Pulse
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {pulseMetrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{metric.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">{metric.score}/10</span>
                  <span className={`text-sm ${metric.color}`}>
                    {metric.trend}
                  </span>
                </div>
              </div>
              <Progress value={metric.score * 10} className="h-2" />
            </div>
          ))}
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Response Rate</span>
              </div>
              <Badge variant="secondary">89% (24/27)</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Engagement Trends</CardTitle>
          <CardDescription>6-month engagement score evolution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[6, 10]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Key Insight</span>
            </div>
            <p className="text-sm text-green-700">
              Engagement scores show consistent improvement over the last 3 months, 
              with highest satisfaction in team collaboration.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
