
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUserObjectives, Objective } from "@/services/objectiveService";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import ObjectiveCard from "./ObjectiveCard";
import { Plus } from "lucide-react";
import CreateOKRDialog from "./CreateOKRDialog";

interface MyObjectivesProps {
  userId: string;
}

export default function MyObjectives({ userId }: MyObjectivesProps) {
  const { toast } = useToast();
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    const fetchObjectives = async () => {
      try {
        setLoading(true);
        const data = await getUserObjectives(userId);
        setObjectives(data);
      } catch (error: any) {
        console.error("Error fetching objectives:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load objectives",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchObjectives();
  }, [userId, toast]);

  const handleCreateOKR = (newObjective: Objective) => {
    setObjectives(prev => [newObjective, ...prev]);
    setIsCreateDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Objectives</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Objective
        </Button>
      </div>

      {objectives.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              You don't have any objectives yet
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Objective
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {objectives.map((objective) => (
            <ObjectiveCard key={objective.id} objective={objective} />
          ))}
        </div>
      )}

      <CreateOKRDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateOKR={handleCreateOKR}
        userId={userId}
      />
    </div>
  );
}
