
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GoalListHeaderProps {
  canEdit: boolean;
}

export default function GoalListHeader({ canEdit }: GoalListHeaderProps) {
  return (
    <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <CardTitle>Performance Goals</CardTitle>
        <CardDescription>
          Track and manage goal progress for this quarter
        </CardDescription>
      </div>
    </CardHeader>
  );
}
