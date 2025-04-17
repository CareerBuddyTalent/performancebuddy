
import { Goal } from "@/types";
import { Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PerformanceGoalTable from "@/components/performance/PerformanceGoalTable";

interface PerformanceGoalsTabProps {
  goals: Goal[];
}

export default function PerformanceGoalsTab({ goals }: PerformanceGoalsTabProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle>Performance Goals</CardTitle>
          <CardDescription>
            Track and manage goal progress for this quarter
          </CardDescription>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <PerformanceGoalTable goals={goals} />
      </CardContent>
    </Card>
  );
}
