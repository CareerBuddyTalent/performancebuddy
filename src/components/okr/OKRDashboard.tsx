
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

export default function OKRDashboard() {
  // Sample data - in a real app, this would come from an API
  const objectiveProgress = [
    { name: 'Completed', value: 25, color: '#4ade80' },
    { name: 'In Progress', value: 45, color: '#60a5fa' },
    { name: 'At Risk', value: 20, color: '#f97316' },
    { name: 'Not Started', value: 10, color: '#94a3b8' },
  ];

  const keyResultsData = [
    { name: 'On Track', value: 60, color: '#4ade80' },
    { name: 'Behind', value: 30, color: '#f97316' },
    { name: 'At Risk', value: 10, color: '#ef4444' },
  ];

  const alignmentScore = 85;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">OKR Completion</CardTitle>
            <CardDescription>Overall progress on objectives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{70}%</div>
            <Progress className="h-2 mt-2" value={70} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Key Results</CardTitle>
            <CardDescription>Progress on key metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{objectiveProgress.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {`${keyResultsData[0].value}% on track`}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Alignment Score</CardTitle>
            <CardDescription>Objectives aligned with company goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alignmentScore}%</div>
            <Progress className="h-2 mt-2" value={alignmentScore} />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Objective Status</CardTitle>
            <CardDescription>Distribution by completion status</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={objectiveProgress}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {objectiveProgress.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Key Results Status</CardTitle>
            <CardDescription>Distribution by performance</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={keyResultsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {keyResultsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
