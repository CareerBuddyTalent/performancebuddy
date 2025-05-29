
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ScatterChart, Scatter, PieChart, Pie, Cell } from "recharts";

const performanceData = [
  { department: 'Engineering', score: 85, previous: 82, satisfaction: 4.2 },
  { department: 'Sales', score: 78, previous: 75, satisfaction: 3.8 },
  { department: 'Marketing', score: 82, previous: 80, satisfaction: 4.0 },
  { department: 'HR', score: 88, previous: 85, satisfaction: 4.5 },
  { department: 'Finance', score: 80, previous: 78, satisfaction: 3.9 }
];

const trendData = [
  { month: 'Jan', performance: 75, engagement: 70, goals: 65 },
  { month: 'Feb', performance: 78, engagement: 72, goals: 70 },
  { month: 'Mar', performance: 82, engagement: 75, goals: 75 },
  { month: 'Apr', performance: 85, engagement: 78, goals: 80 },
  { month: 'May', performance: 87, engagement: 80, goals: 85 },
  { month: 'Jun', performance: 89, engagement: 82, goals: 88 }
];

const distributionData = [
  { name: 'Excellent (90-100)', value: 15, color: '#10b981' },
  { name: 'Good (80-89)', value: 35, color: '#3b82f6' },
  { name: 'Satisfactory (70-79)', value: 30, color: '#f59e0b' },
  { name: 'Needs Improvement (<70)', value: 20, color: '#ef4444' }
];

export function EnhancedDataVisualization() {
  const [chartType, setChartType] = useState('bar');
  const [dataView, setDataView] = useState('department');

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="performance" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="engagement" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="goals" stroke="#ffc658" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="score" name="Performance Score" />
              <YAxis dataKey="satisfaction" name="Satisfaction" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter dataKey="score" fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#8884d8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="previous" fill="#82ca9d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enhanced Data Visualization</CardTitle>
        <CardDescription>
          Interactive charts and graphs for deep performance analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Chart Type:</label>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="scatter">Scatter Plot</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Data View:</label>
            <Select value={dataView} onValueChange={setDataView}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="department">By Department</SelectItem>
                <SelectItem value="role">By Role</SelectItem>
                <SelectItem value="manager">By Manager</SelectItem>
                <SelectItem value="time">Over Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          {renderChart()}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="font-medium text-blue-900">Key Insights</div>
            <div className="text-blue-700 mt-1">
              {chartType === 'bar' && 'HR department shows highest performance scores'}
              {chartType === 'line' && 'Consistent upward trend across all metrics'}
              {chartType === 'scatter' && 'Strong correlation between performance and satisfaction'}
              {chartType === 'pie' && '50% of employees perform at good or excellent levels'}
            </div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="font-medium text-green-900">Top Performers</div>
            <div className="text-green-700 mt-1">
              Engineering and HR departments leading in overall metrics
            </div>
          </div>
          
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="font-medium text-orange-900">Areas for Focus</div>
            <div className="text-orange-700 mt-1">
              Sales team shows opportunity for engagement improvement
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
