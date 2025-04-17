
import { Card, CardContent } from "@/components/ui/card";

interface PerformanceStatsCardsProps {
  goalsCompletion: number;
  roadmapCompletion: number;
  activeGoalsCount: number;
}

export default function PerformanceStatsCards({
  goalsCompletion,
  roadmapCompletion,
  activeGoalsCount
}: PerformanceStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-amber-500 text-3xl font-bold">{goalsCompletion}%</div>
          <p className="text-sm text-muted-foreground">Goals Completion</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-emerald-500 text-3xl font-bold">{roadmapCompletion}%</div>
          <p className="text-sm text-muted-foreground">Overall Progress</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-blue-500 text-3xl font-bold">{activeGoalsCount}</div>
          <p className="text-sm text-muted-foreground">Active Goals</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-purple-500 text-3xl font-bold">Q3</div>
          <p className="text-sm text-muted-foreground">Current Period</p>
        </CardContent>
      </Card>
    </div>
  );
}
