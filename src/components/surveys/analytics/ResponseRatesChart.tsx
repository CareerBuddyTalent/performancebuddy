
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const sampleData = [
  { name: "Employee Engagement", responseRate: 85 },
  { name: "Work Environment", responseRate: 78 },
  { name: "Manager Feedback", responseRate: 92 },
  { name: "Training Needs", responseRate: 65 },
  { name: "Company Culture", responseRate: 88 },
];

export default function ResponseRatesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Survey Response Rates</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sampleData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="responseRate" fill="#7c67dd" name="Response Rate %" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
