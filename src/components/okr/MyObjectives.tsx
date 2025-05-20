
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, BarChart, Check, X } from "lucide-react";
import ObjectiveCard from "./ObjectiveCard";
import CreateKeyResultDialog from "./CreateKeyResultDialog";
import { Objective } from "@/types/okr";

interface MyObjectivesProps {
  userId: string;
}

export default function MyObjectives({ userId }: MyObjectivesProps) {
  const [showCreateKR, setShowCreateKR] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);
  
  // Sample objectives - in a real app, these would come from an API
  const objectives = [
    {
      id: "1",
      userId,
      title: "Improve Technical Skills",
      description: "Enhance my technical capabilities to better contribute to team projects",
      status: "active" as const,
      progress: 60,
      startDate: new Date("2025-04-01"),
      endDate: new Date("2025-06-30"),
      level: "individual" as const,
      createdAt: new Date("2025-03-20"),
      updatedAt: new Date("2025-05-10"),
      keyResults: [
        {
          id: "kr1",
          objectiveId: "1",
          title: "Complete Advanced React Course",
          type: "percentage" as const,
          currentValue: 80,
          targetValue: 100,
          startValue: 0,
          progress: 80,
          dueDate: new Date("2025-05-30"),
          status: "in_progress" as const
        },
        {
          id: "kr2",
          objectiveId: "1",
          title: "Contribute to 5 team projects",
          type: "number" as const,
          currentValue: 3,
          targetValue: 5,
          startValue: 0,
          progress: 60,
          dueDate: new Date("2025-06-15"),
          status: "in_progress" as const
        }
      ]
    },
    {
      id: "2",
      userId,
      title: "Improve Communication",
      description: "Enhance communication skills through public speaking and documentation",
      status: "active" as const,
      progress: 40,
      startDate: new Date("2025-04-01"),
      endDate: new Date("2025-06-30"),
      level: "individual" as const,
      createdAt: new Date("2025-03-25"),
      updatedAt: new Date("2025-05-05"),
      keyResults: [
        {
          id: "kr3",
          objectiveId: "2",
          title: "Present at 3 team meetings",
          type: "number" as const,
          currentValue: 1,
          targetValue: 3,
          startValue: 0,
          progress: 33,
          dueDate: new Date("2025-06-30"),
          status: "in_progress" as const
        },
        {
          id: "kr4",
          objectiveId: "2",
          title: "Improve documentation quality rating",
          type: "percentage" as const,
          currentValue: 75,
          targetValue: 90,
          startValue: 60,
          progress: 50,
          dueDate: new Date("2025-06-30"),
          status: "in_progress" as const
        }
      ]
    }
  ];

  // Function to handle adding a key result to an objective
  const handleAddKeyResult = (objectiveId: string) => {
    const objective = objectives.find(o => o.id === objectiveId);
    if (objective) {
      setSelectedObjective(objective);
      setShowCreateKR(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">My Objectives</h2>
          <p className="text-sm text-muted-foreground">Track your personal OKRs</p>
        </div>
        <Button variant="outline" size="sm">
          <BarChart className="h-4 w-4 mr-2" />
          Progress Report
        </Button>
      </div>
      
      {objectives.length > 0 ? (
        <div className="grid gap-6">
          {objectives.map((objective) => (
            <ObjectiveCard
              key={objective.id}
              objective={objective}
              onAddKeyResult={() => handleAddKeyResult(objective.id)}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No Objectives Yet</CardTitle>
            <CardDescription>
              Create your first objective to start tracking your progress
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Objective
            </Button>
          </CardContent>
        </Card>
      )}

      {selectedObjective && (
        <CreateKeyResultDialog
          open={showCreateKR}
          onOpenChange={setShowCreateKR}
          objective={selectedObjective}
          onCreateKeyResult={() => setShowCreateKR(false)}
        />
      )}
    </div>
  );
}
