import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { List, Plus, BarChart } from "lucide-react";
import { getUserObjectives, Objective } from "@/services/objectiveService";
import { ObjectiveCard } from "./ObjectiveCard";
import { toast } from "sonner";

interface MyObjectivesProps {
  userId: string;
}

export default function MyObjectives({ userId }: MyObjectivesProps) {
  const [myObjectives, setMyObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"card" | "list">("card");

  useEffect(() => {
    const fetchObjectives = async () => {
      try {
        setLoading(true);
        const objectives = await getUserObjectives(userId);
        setMyObjectives(objectives);
      } catch (error: any) {
        console.error("Error fetching objectives:", error);
        toast.error("Failed to load objectives");
      } finally {
        setLoading(false);
      }
    };

    fetchObjectives();
  }, [userId]);

  const handleAddKeyResult = (objectiveId: string) => {
    // In a real app, this would open a dialog to add a key result
    console.log("Add key result to", objectiveId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">My Objectives</h2>
          <p className="text-sm text-muted-foreground">Track your personal objectives and key results</p>
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

      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4">
              <CardHeader>
                <CardTitle><Skeleton className="h-5 w-40" /></CardTitle>
                <CardDescription><Skeleton className="h-4 w-60" /></CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-2 w-full mt-2" />
                <div className="mt-4 flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : myObjectives.length > 0 ? (
        <div className="grid gap-6">
          {myObjectives.map((objective) => (
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
            <CardTitle>No Objectives</CardTitle>
            <CardDescription>
              You don't have any objectives yet. Create one to get started!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create Objective
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
