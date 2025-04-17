
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";

interface PerformanceHeaderProps {
  onAddGoal: () => void;
}

export default function PerformanceHeader({ onAddGoal }: PerformanceHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Performance</h1>
        <p className="text-muted-foreground">
          Manage and track performance metrics across the organization
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button onClick={onAddGoal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>
    </div>
  );
}
