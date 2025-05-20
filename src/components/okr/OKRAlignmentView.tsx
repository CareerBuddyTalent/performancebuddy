import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Objective } from "@/services/objectiveService";

interface OKRAlignmentViewProps {
  objectives: Objective[];
  onViewObjective: (objective: Objective) => void;
}

export default function OKRAlignmentView({ objectives, onViewObjective }: OKRAlignmentViewProps) {
  const { toast } = useToast();
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);

  const handleView = (objective: Objective) => {
    setSelectedObjective(objective);
    onViewObjective(objective);
  };

  return (
    <Card>
      <CardContent>
        <h2 className="text-lg font-semibold mb-4">Objectives</h2>
        {objectives.length > 0 ? (
          <ul className="space-y-2">
            {objectives.map((objective) => (
              <li key={objective.id} className="flex items-center justify-between">
                <span>{objective.title}</span>
                <Button variant="outline" size="sm" onClick={() => handleView(objective)}>
                  View Details
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No objectives found.</p>
        )}
      </CardContent>
    </Card>
  );
}
