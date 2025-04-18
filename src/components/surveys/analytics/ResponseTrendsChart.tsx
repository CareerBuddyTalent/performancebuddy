
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const trendData = [
  { month: "Jan", responses: 45, avgCompletionTime: 8 },
  { month: "Feb", responses: 52, avgCompletionTime: 7 },
  { month: "Mar", responses: 48, avgCompletionTime: 9 },
  { month: "Apr", responses: 70, avgCompletionTime: 6 },
  { month: "May", responses: 65, avgCompletionTime: 7 },
  { month: "Jun", responses: 85, avgCompletionTime: 5 },
];

export default function ResponseTrendsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Trends</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line yAxisId="left" type="monotone" dataKey="responses" stroke="#7c67dd" name="Total Responses" />
            <Line yAxisId="right" type="monotone" dataKey="avgCompletionTime" stroke="#38bdf8" name="Avg. Time (min)" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
