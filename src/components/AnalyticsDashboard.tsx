
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, Pie, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface AnalyticsDashboardProps {
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  onTimeframeChange: (timeframe: 'week' | 'month' | 'quarter' | 'year') => void;
}

// Sample analytics data
const performanceData = [
  { month: 'Jan', avgRating: 3.8, goalCompletion: 68 },
  { month: 'Feb', avgRating: 3.9, goalCompletion: 72 },
  { month: 'Mar', avgRating: 4.1, goalCompletion: 75 },
  { month: 'Apr', avgRating: 4.0, goalCompletion: 70 },
  { month: 'May', avgRating: 4.2, goalCompletion: 82 },
  { month: 'Jun', avgRating: 4.3, goalCompletion: 85 },
];

const skillDistributionData = [
  { name: 'Beginner (1-2)', value: 25, color: '#94a3b8' },
  { name: 'Intermediate (3)', value: 40, color: '#9B87F5' },
  { name: 'Advanced (4)', value: 25, color: '#7c67dd' },
  { name: 'Expert (5)', value: 10, color: '#5840c7' },
];

const engagementScores = [
  { category: 'Work Environment', score: 3.9 },
  { category: 'Leadership', score: 4.1 },
  { category: 'Team Collaboration', score: 4.2 },
  { category: 'Growth Opportunities', score: 3.6 },
  { category: 'Work-Life Balance', score: 3.7 },
  { category: 'Recognition', score: 3.8 },
];

export default function AnalyticsDashboard({ timeframe, onTimeframeChange }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">Performance Analytics</h2>
          <p className="text-muted-foreground">AI-powered insights from your organization's data</p>
        </div>
        <TabsList>
          <TabsTrigger 
            value="week" 
            onClick={() => onTimeframeChange('week')}
            data-state={timeframe === 'week' ? 'active' : 'inactive'}
          >
            Week
          </TabsTrigger>
          <TabsTrigger 
            value="month" 
            onClick={() => onTimeframeChange('month')}
            data-state={timeframe === 'month' ? 'active' : 'inactive'}
          >
            Month
          </TabsTrigger>
          <TabsTrigger 
            value="quarter" 
            onClick={() => onTimeframeChange('quarter')}
            data-state={timeframe === 'quarter' ? 'active' : 'inactive'}
          >
            Quarter
          </TabsTrigger>
          <TabsTrigger 
            value="year" 
            onClick={() => onTimeframeChange('year')}
            data-state={timeframe === 'year' ? 'active' : 'inactive'}
          >
            Year
          </TabsTrigger>
        </TabsList>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Average ratings and goal completion over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" domain={[0, 5]} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="avgRating" 
                  name="Avg Rating" 
                  stroke="#9B87F5" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="goalCompletion" 
                  name="Goal Completion %" 
                  stroke="#38bdf8" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Skill Distribution</CardTitle>
            <CardDescription>Current skill levels across the organization</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {skillDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Engagement Survey Results</CardTitle>
            <CardDescription>Latest engagement scores by category</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={engagementScores}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 5]} />
                <YAxis dataKey="category" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="score" fill="#9B87F5" radius={[0, 4, 4, 0]}>
                  {engagementScores.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score >= 4 ? '#7c67dd' : '#9B87F5'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Insights</CardTitle>
          <CardDescription>Automatically generated observations from your organization's data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Key Performance Patterns</h3>
              <ul className="space-y-2 text-sm">
                <li>• Teams with weekly check-ins show 23% higher goal completion rates</li>
                <li>• Leadership ratings have improved 12% quarter-over-quarter</li>
                <li>• Technical skill development is outpacing soft skill growth by 18%</li>
                <li>• Employees who set aligned goals have 34% higher performance ratings</li>
              </ul>
            </div>
            
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Recommendations</h3>
              <ul className="space-y-2 text-sm">
                <li>• Increase focus on soft skills training for technical teams</li>
                <li>• Address work-life balance concerns in the Marketing department</li>
                <li>• Recognize top performers in Engineering who've exceeded Q2 goals</li>
                <li>• Schedule goal alignment sessions for underperforming teams</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
