
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const executionData = [
  { month: 'Jan', executions: 145, successful: 139, failed: 6 },
  { month: 'Feb', executions: 168, successful: 163, failed: 5 },
  { month: 'Mar', executions: 192, successful: 186, failed: 6 },
  { month: 'Apr', executions: 178, successful: 174, failed: 4 },
  { month: 'May', executions: 203, successful: 198, failed: 5 },
  { month: 'Jun', executions: 224, successful: 219, failed: 5 }
];

const performanceData = [
  { workflow: 'Onboarding', avgTime: 12, successRate: 96 },
  { workflow: 'Reviews', avgTime: 8, successRate: 98 },
  { workflow: 'Goals', avgTime: 15, successRate: 94 },
  { workflow: 'Training', avgTime: 22, successRate: 89 }
];

export function WorkflowAnalytics() {
  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">1,110</div>
            <p className="text-sm text-muted-foreground">Total Executions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">96.2%</div>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">14.3s</div>
            <p className="text-sm text-muted-foreground">Avg Execution Time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">42h</div>
            <p className="text-sm text-muted-foreground">Time Saved</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Execution Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Executions</CardTitle>
            <CardDescription>Monthly execution trends with success/failure rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={executionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="successful" stackId="a" fill="#22c55e" />
                <Bar dataKey="failed" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by Workflow</CardTitle>
            <CardDescription>Average execution time and success rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.map((workflow) => (
                <div key={workflow.workflow} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{workflow.workflow}</span>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{workflow.avgTime}s avg</span>
                      <span>{workflow.successRate}% success</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-green-500 rounded-full" 
                      style={{ width: `${workflow.successRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Error Analysis</CardTitle>
          <CardDescription>Common failure patterns and recommended actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <h4 className="font-medium">Email Delivery Failures</h4>
                <p className="text-sm text-muted-foreground">15 occurrences in the last 30 days</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">12%</div>
                <div className="text-sm text-muted-foreground">of total errors</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <h4 className="font-medium">Timeout Issues</h4>
                <p className="text-sm text-muted-foreground">8 occurrences in the last 30 days</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-600">8%</div>
                <div className="text-sm text-muted-foreground">of total errors</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
