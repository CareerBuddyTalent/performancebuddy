
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AiInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Generated Insights</CardTitle>
        <CardDescription>Automatically generated observations from your organization's data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-2">Key Performance Patterns</h3>
            <ul className="space-y-2 text-sm">
              <li>• Teams with weekly check-ins show 23% higher goal completion rates</li>
              <li>• Leadership ratings have improved 12% quarter-over-quarter</li>
              <li>• Technical skill development is outpacing soft skill growth by 18%</li>
              <li>• Employees who set aligned goals have 34% higher performance ratings</li>
            </ul>
          </div>
          
          <div className="rounded-lg border p-4">
            <h3 className="font-medium mb-2">Recommendations</h3>
            <ul className="space-y-2 text-sm">
              <li>• Increase focus on soft skills training for technical teams</li>
              <li>• Address work-life balance concerns in the Marketing department</li>
              <li>• Recognize top performers in Engineering who've exceeded Q2 goals</li>
              <li>• Schedule goal alignment sessions for underperforming teams</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
