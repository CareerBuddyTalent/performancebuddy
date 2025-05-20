
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, List } from "lucide-react";
import ObjectiveCard from "./ObjectiveCard";
import { useState } from "react";
import { Objective } from "@/types/okr";

interface TeamObjectivesProps {
  managerId: string;
}

export default function TeamObjectives({ managerId }: TeamObjectivesProps) {
  // Sample team objectives - in a real app, these would come from an API
  const teamObjectives: Objective[] = [
    {
      id: "3",
      userId: "team1",
      title: "Improve Team Velocity",
      description: "Increase the team's delivery speed while maintaining quality",
      status: "active" as const,
      progress: 75,
      startDate: new Date("2025-04-01"),
      endDate: new Date("2025-06-30"),
      level: "team" as const,
      createdAt: new Date("2025-03-15"),
      updatedAt: new Date("2025-05-12"),
      keyResults: [
        {
          id: "kr5",
          objectiveId: "3",
          title: "Reduce average story completion time by 20%",
          type: "percentage" as const,
          currentValue: 15,
          targetValue: 20,
          startValue: 0,
          progress: 75,
          dueDate: new Date("2025-06-15"),
          status: "in_progress" as const
        },
        {
          id: "kr6",
          objectiveId: "3",
          title: "Implement 3 process improvements",
          type: "number" as const,
          currentValue: 2,
          targetValue: 3,
          startValue: 0,
          progress: 67,
          dueDate: new Date("2025-06-30"),
          status: "in_progress" as const
        }
      ]
    },
    {
      id: "4",
      userId: "team1",
      title: "Enhance Code Quality",
      description: "Improve overall quality of the codebase through better practices and testing",
      status: "active" as const,
      progress: 50,
      startDate: new Date("2025-04-01"),
      endDate: new Date("2025-06-30"),
      level: "team" as const,
      createdAt: new Date("2025-03-18"),
      updatedAt: new Date("2025-05-08"),
      keyResults: [
        {
          id: "kr7",
          objectiveId: "4",
          title: "Increase test coverage to 80%",
          type: "percentage" as const,
          currentValue: 65,
          targetValue: 80,
          startValue: 50,
          progress: 50,
          dueDate: new Date("2025-06-15"),
          status: "in_progress" as const
        },
        {
          id: "kr8",
          objectiveId: "4",
          title: "Reduce critical bugs by 30%",
          type: "percentage" as const,
          currentValue: 15,
          targetValue: 30,
          startValue: 0,
          progress: 50,
          dueDate: new Date("2025-06-30"),
          status: "in_progress" as const
        }
      ]
    }
  ];

  const handleAddKeyResult = (objectiveId: string) => {
    // In a real app, this would open a dialog to add a key result
    console.log("Add key result to", objectiveId);
  };

  const [view, setView] = useState<"card" | "list">("card");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Team Objectives</h2>
          <p className="text-sm text-muted-foreground">Track your team's progress</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={view === "card" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("card")}
          >
            <BarChart className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {teamObjectives.length > 0 ? (
        <div className="grid gap-6">
          {teamObjectives.map((objective) => (
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
            <CardTitle>No Team Objectives</CardTitle>
            <CardDescription>
              Create team objectives to track your team's progress
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button>Create Team Objective</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
