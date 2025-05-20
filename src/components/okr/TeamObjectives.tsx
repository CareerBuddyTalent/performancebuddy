import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getTeamObjectives, Objective } from "@/services/objectiveService";
import { ObjectiveCard } from "./ObjectiveCard";
import { Button } from "@/components/ui/button";
import { List, BarChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface TeamObjectivesProps {
  managerId: string;
}

export default function TeamObjectives({ managerId }: TeamObjectivesProps) {
  const [teamObjectives, setTeamObjectives] = useState<Objective[]>([]);
  const [view, setView] = useState<"card" | "list">("card");

  useEffect(() => {
    const fetchTeamObjectives = async () => {
      try {
        const objectives = await getTeamObjectives(managerId);
        setTeamObjectives(objectives);
      } catch (error) {
        toast.error("Failed to fetch team objectives");
      }
    };

    fetchTeamObjectives();
  }, [managerId]);

  const handleAddKeyResult = (objectiveId: string) => {
    // In a real app, this would open a dialog to add a key result
    console.log("Add key result to", objectiveId);
  };

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
              onView={() => console.log("View objective", objective.id)}
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
