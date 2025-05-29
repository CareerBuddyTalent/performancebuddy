
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ScatterChart,
  Scatter
} from 'recharts';
import { TrendingUp, Users, Target, Award } from "lucide-react";

const performanceData = [
  { department: 'Engineering', performance: 8.5, engagement: 8.2, retention: 95 },
  { department: 'Sales', performance: 7.8, engagement: 7.5, retention: 88 },
  { department: 'Marketing', performance: 8.1, engagement: 8.0, retention: 92 },
  { department: 'Support', performance: 8.3, engagement: 7.8, retention: 90 },
  { department: 'HR', performance: 7.9, engagement: 8.1, retention: 94 }
];

const trendData = [
  { month: 'Jan', performance: 7.2, goals: 78, feedback: 85 },
  { month: 'Feb', performance: 7.5, goals: 82, feedback: 87 },
  { month: 'Mar', performance: 7.1, goals: 75, feedback: 83 },
  { month: 'Apr', performance: 7.8, goals: 88, feedback: 89 },
  { month: 'May', performance: 8.2, goals: 92, feedback: 91 },
  { month: 'Jun', performance: 8.0, goals: 89, feedback: 88 }
];

const distributionData = [
  { name: 'Exceeds Expectations', value: 25, color: '#10B981' },
  { name: 'Meets Expectations', value: 60, color: '#3B82F6' },
  { name: 'Below Expectations', value: 12, color: '#F59E0B' },
  { name: 'Needs Improvement', value: 3, color: '#EF4444' }
];

const correlationData = [
  { engagement: 6.5, performance: 6.8, retention: 85 },
  { engagement: 7.2, performance: 7.5, retention: 88 },
  { engagement: 8.1, performance: 8.3, retention: 92 },
  { engagement: 7.8, performance: 8.0, retention: 90 },
  { engagement: 8.5, performance: 8.7, retention: 95 },
  { engagement: 7.0, performance: 7.2, retention: 87 },
  { engagement: 8.2, performance: 8.1, retention: 94 }
];

export function EnhancedDataVisualization() {
  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Performance</p>
                <p className="text-2xl font-bold">8.1</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +0.3 vs last month
                </p>
              </div>
              <Award className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engagement Score</p>
                <p className="text-2xl font-bold">7.9</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +0.2 vs last month
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Goal Completion</p>
                <p className="text-2xl font-bold">89%</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +5% vs last month
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Retention Rate</p>
                <p className="text-2xl font-bold">91%</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Stable
                </p>
              </div>
              <Badge variant="secondary" className="text-lg">91%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Charts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Advanced Analytics Dashboard</CardTitle>
              <CardDescription>Interactive data visualizations with multiple chart types</CardDescription>
            </div>
            <Select defaultValue="department">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="department">By Department</SelectItem>
                <SelectItem value="role">By Role</SelectItem>
                <SelectItem value="manager">By Manager</SelectItem>
                <SelectItem value="tenure">By Tenure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="performance" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              <TabsTrigger value="correlation">Correlation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="performance" fill="#3B82F6" name="Performance Score" />
                  <Bar dataKey="engagement" fill="#10B981" name="Engagement Score" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="trends" className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="performance" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="goals" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="feedback" stroke="#F59E0B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="distribution" className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="correlation" className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={correlationData}>
                  <CartesianGrid />
                  <XAxis dataKey="engagement" type="number" domain={[6, 9]} name="Engagement" />
                  <YAxis dataKey="performance" type="number" domain={[6, 9]} name="Performance" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter dataKey="retention" fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
