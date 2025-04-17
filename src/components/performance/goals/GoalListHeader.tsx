
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Settings } from "lucide-react";

interface GoalListHeaderProps {
  canEdit: boolean;
  onAddGoal: () => void;
  onOpenSettings: () => void;
}

export default function GoalListHeader({ 
  canEdit, 
  onAddGoal, 
  onOpenSettings 
}: GoalListHeaderProps) {
  return (
    <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <CardTitle>Performance Goals</CardTitle>
        <CardDescription>
          Track and manage goal progress for this quarter
        </CardDescription>
      </div>
      
      <div className="flex items-center gap-2">
        {canEdit && (
          <>
            <Button variant="outline" size="sm" onClick={onOpenSettings}>
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
            <Button size="sm" onClick={onAddGoal}>
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </>
        )}
      </div>
    </CardHeader>
  );
}
