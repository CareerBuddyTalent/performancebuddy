import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import OKRAlignmentEditor from "@/components/okr/OKRAlignmentEditor";
import OKRHierarchyTree from "@/components/okr/OKRHierarchyTree";
import { getObjectiveHierarchy, updateObjectiveAlignment, Objective } from "@/services/objectiveService";

export default function OKRAlignment() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"editor" | "tree">("editor");

  useEffect(() => {
    const fetchObjectives = async () => {
      try {
        setLoading(true);
        const data = await getObjectiveHierarchy();
        setObjectives(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load objectives",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchObjectives();
  }, [toast]);

  const handleAlignmentUpdate = async (objectiveId: string, parentId: string | null) => {
    try {
      await updateObjectiveAlignment(objectiveId, parentId);
      
      // Update local state to reflect the change
      setObjectives(prevObjectives => 
        prevObjectives.map(obj => 
          obj.id === objectiveId ? { ...obj, parent_id: parentId } : obj
        )
      );
      
      return;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update alignment",
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleViewObjective = (objective: Objective) => {
    // Navigate to objective detail page or open details dialog
    console.log("View objective", objective);
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin' || user.role === 'manager';

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
        <div>
          <h1 className="text-2xl font-semibold">OKR Alignment</h1>
          <p className="text-muted-foreground">Align objectives across your organization</p>
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as "editor" | "tree")}>
          <TabsList>
            <TabsTrigger value="editor">Drag & Drop Editor</TabsTrigger>
            <TabsTrigger value="tree">Hierarchy View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Objective Hierarchy</CardTitle>
          <CardDescription>
            {view === "editor" 
              ? "Drag and drop objectives to create alignments" 
              : "View and navigate the complete objective hierarchy"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {view === "editor" ? (
            <OKRAlignmentEditor 
              objectives={objectives}
              onAlignmentUpdate={handleAlignmentUpdate}
            />
          ) : (
            <OKRHierarchyTree
              objectives={objectives}
              onCreateObjective={isAdmin ? (parentId) => console.log("Create with parent:", parentId) : undefined}
              onViewObjective={handleViewObjective}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
