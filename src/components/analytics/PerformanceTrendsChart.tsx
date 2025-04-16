
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Sample performance data
const performanceData = [
  { month: 'Jan', avgRating: 3.8, goalCompletion: 68 },
  { month: 'Feb', avgRating: 3.9, goalCompletion: 72 },
  { month: 'Mar', avgRating: 4.1, goalCompletion: 75 },
  { month: 'Apr', avgRating: 4.0, goalCompletion: 70 },
  { month: 'May', avgRating: 4.2, goalCompletion: 82 },
  { month: 'Jun', avgRating: 4.3, goalCompletion: 85 },
];

export default function PerformanceTrendsChart() {
  return (
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
  );
}
