
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Sample skill distribution data
const skillDistributionData = [
  { name: 'Beginner (1-2)', value: 25, color: '#94a3b8' },
  { name: 'Intermediate (3)', value: 40, color: '#9B87F5' },
  { name: 'Advanced (4)', value: 25, color: '#7c67dd' },
  { name: 'Expert (5)', value: 10, color: '#5840c7' },
];

export default function SkillDistributionChart() {
  return (
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
  );
}
