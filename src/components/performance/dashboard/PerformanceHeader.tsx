
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
    </div>
  );
}
