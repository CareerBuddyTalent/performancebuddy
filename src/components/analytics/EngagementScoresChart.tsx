
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Sample engagement scores data
const engagementScores = [
  { category: 'Work Environment', score: 3.9 },
  { category: 'Leadership', score: 4.1 },
  { category: 'Team Collaboration', score: 4.2 },
  { category: 'Growth Opportunities', score: 3.6 },
  { category: 'Work-Life Balance', score: 3.7 },
  { category: 'Recognition', score: 3.8 },
];

export default function EngagementScoresChart() {
  return (
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
  );
}
