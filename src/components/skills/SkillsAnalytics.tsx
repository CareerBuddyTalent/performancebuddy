
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";

export function SkillsAnalytics() {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle>Skills Analytics</CardTitle>
          <CardDescription>View skills distribution and gaps</CardDescription>
        </div>
        <Button variant="outline">
          <BarChart className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">Analytics features coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
}
