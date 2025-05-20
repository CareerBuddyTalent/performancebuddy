
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDownToLine, Filter, Sliders } from "lucide-react";
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis,
  CartesianGrid, 
  Tooltip, 
  Legend, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import PerformanceBenchmarkChart from "./PerformanceBenchmarkChart";

// Sample data - in a real app, this would come from props or API
const mockPerformanceComparisonData = [
  { name: 'Communication', value: 4.2, benchmark: 3.8, industryAverage: 3.9, teamTarget: 4.5 },
  { name: 'Technical Skills', value: 3.9, benchmark: 4.1, industryAverage: 3.7, teamTarget: 4.0 },
  { name: 'Leadership', value: 3.5, benchmark: 3.3, industryAverage: 3.6, teamTarget: 4.0 },
  { name: 'Initiative', value: 4.0, benchmark: 3.9, industryAverage: 3.8, teamTarget: 4.2 },
  { name: 'Teamwork', value: 4.7, benchmark: 4.2, industryAverage: 4.3, teamTarget: 4.5 },
];

const mockTeamComparisonData = [
  { name: 'Engineering', value: 4.1, benchmark: 3.9, industryAverage: 4.0, teamTarget: 4.3 },
  { name: 'Design', value: 4.3, benchmark: 4.0, industryAverage: 4.1, teamTarget: 4.5 },
  { name: 'Product', value: 3.8, benchmark: 3.7, industryAverage: 3.9, teamTarget: 4.0 },
  { name: 'Marketing', value: 4.0, benchmark: 3.8, industryAverage: 3.7, teamTarget: 4.2 },
  { name: 'Sales', value: 4.2, benchmark: 4.1, industryAverage: 4.0, teamTarget: 4.4 },
];

const mockTrendsData = [
  { month: 'Jan', current: 3.7, previous: 3.5, target: 4.0 },
  { month: 'Feb', current: 3.8, previous: 3.6, target: 4.0 },
  { month: 'Mar', current: 3.9, previous: 3.7, target: 4.0 },
  { month: 'Apr', current: 4.1, previous: 3.8, target: 4.0 },
  { month: 'May', current: 4.0, previous: 3.9, target: 4.0 },
  { month: 'Jun', current: 4.2, previous: 3.9, target: 4.0 },
];

const mockDistributionData = [
  { name: 'Exceeding', value: 25, color: '#22c55e' },
  { name: 'Meeting', value: 40, color: '#3b82f6' },
  { name: 'Developing', value: 25, color: '#f59e0b' },
  { name: 'Needs Improvement', value: 10, color: '#ef4444' },
];

interface PerformanceBenchmarkingDashboardProps {
  timeframe?: 'week' | 'month' | 'quarter' | 'year';
}

export default function PerformanceBenchmarkingDashboard({ 
  timeframe = 'quarter' 
}: PerformanceBenchmarkingDashboardProps) {
  const [activeTab, setActiveTab] = useState("metrics");
  const [metricsPeriod, setMetricsPeriod] = useState("current");
  const [selectedTeam, setSelectedTeam] = useState("all");
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Performance Benchmarking</h2>
          <p className="text-muted-foreground">Compare team and individual performance against benchmarks</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter Data
          </Button>
          <Button variant="outline" size="sm">
            <ArrowDownToLine className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Performance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">4.1</div>
              <div className="text-xs text-muted-foreground">+0.3 from last {timeframe}</div>
            </div>
            <div className="mt-4 h-2 w-full bg-secondary overflow-hidden rounded-full">
              <div className="h-full bg-primary" style={{ width: '82%' }}></div>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              <div>Below Target</div>
              <div>Target: 5.0</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Team Variation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">0.5</div>
              <div className="text-xs text-muted-foreground">-0.2 from last {timeframe}</div>
            </div>
            <div className="mt-4 h-2 w-full bg-secondary overflow-hidden rounded-full">
              <div className="h-full bg-emerald-600" style={{ width: '30%' }}></div>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              <div>Low Variation</div>
              <div>Target: < 0.8</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Industry Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">76<span className="text-sm font-medium">%</span></div>
              <div className="text-xs text-muted-foreground">+5% from last {timeframe}</div>
            </div>
            <div className="mt-4 h-2 w-full bg-secondary overflow-hidden rounded-full">
              <div className="h-full bg-blue-600" style={{ width: '76%' }}></div>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              <div>Top 25% of Industry</div>
              <div>Target: 80%</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="metrics">Metrics Comparison</TabsTrigger>
          <TabsTrigger value="teams">Team Benchmarks</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="distribution">Distribution Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics" className="py-4 space-y-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold">Competency Benchmarks</h3>
            <Select 
              value={metricsPeriod}
              onValueChange={setMetricsPeriod}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Period</SelectItem>
                <SelectItem value="previous">Previous Period</SelectItem>
                <SelectItem value="yearly">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <PerformanceBenchmarkChart
            title="Competency Benchmarks"
            description="Performance metrics compared to benchmarks"
            timeframe={timeframe}
            data={mockPerformanceComparisonData}
          />
        </TabsContent>
        
        <TabsContent value="teams" className="py-4 space-y-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold">Team Performance</h3>
            <Select 
              value={selectedTeam}
              onValueChange={setSelectedTeam}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <PerformanceBenchmarkChart
            title="Team Performance Comparison"
            description="Team performance metrics compared to benchmarks"
            timeframe={timeframe}
            data={mockTeamComparisonData}
          />
        </TabsContent>
        
        <TabsContent value="trends" className="py-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>
                Current vs previous period performance trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={mockTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="current" name="Current Period" fill="#4f46e5" />
                    <Bar dataKey="previous" name="Previous Period" fill="#94a3b8" />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      name="Target" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution" className="py-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
                <CardDescription>
                  Distribution of performance ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {mockDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution Over Time</CardTitle>
                <CardDescription>
                  How performance distribution has changed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { month: 'Jan', exceeding: 20, meeting: 35, developing: 30, needs_improvement: 15 },
                        { month: 'Feb', exceeding: 22, meeting: 37, developing: 28, needs_improvement: 13 },
                        { month: 'Mar', exceeding: 24, meeting: 38, developing: 27, needs_improvement: 11 },
                        { month: 'Apr', exceeding: 25, meeting: 40, developing: 25, needs_improvement: 10 },
                        { month: 'May', exceeding: 27, meeting: 42, developing: 22, needs_improvement: 9 },
                        { month: 'Jun', exceeding: 25, meeting: 40, developing: 25, needs_improvement: 10 },
                      ]}
                      stackOffset="expand"
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(tick) => `${tick * 100}%`} />
                      <Tooltip formatter={(value) => `${(value * 100).toFixed(0)}%`} />
                      <Area 
                        type="monotone" 
                        dataKey="needs_improvement" 
                        name="Needs Improvement"
                        stackId="1" 
                        stroke="#ef4444" 
                        fill="#ef4444" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="developing" 
                        name="Developing"
                        stackId="1" 
                        stroke="#f59e0b" 
                        fill="#f59e0b" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="meeting" 
                        name="Meeting"
                        stackId="1" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="exceeding" 
                        name="Exceeding"
                        stackId="1" 
                        stroke="#22c55e" 
                        fill="#22c55e" 
                      />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
