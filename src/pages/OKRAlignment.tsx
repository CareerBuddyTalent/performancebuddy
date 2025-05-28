import React, { useState, useEffect } from "react";
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import OKRHierarchyTree from "@/components/okr/OKRHierarchyTree";
import OKRAlignmentView from "@/components/okr/OKRAlignmentView";
import CreateOKRDialog from "@/components/okr/CreateOKRDialog";
import { Objective, getUserObjectives } from "@/services/objectiveService";

export default function OKRAlignment() {
  const { user } = useSupabaseAuth();
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    const fetchObjectives = async () => {
      if (user) {
        const userObjectives = await getUserObjectives(user.id);
        setObjectives(userObjectives);
      }
    };

    fetchObjectives();
  }, [user]);

  const handleCreateObjective = (newObjective: Objective) => {
    setObjectives(prevObjectives => [...prevObjectives, newObjective]);
  };

  const handleViewObjective = (objective: Objective) => {
    setSelectedObjective(objective);
  };

  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-4">OKR Alignment</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1">
          <OKRHierarchyTree
            objectives={objectives}
            onCreateObjective={handleCreateDialogOpen}
            onViewObjective={handleViewObjective}
          />
        </div>
        
        <div className="col-span-1">
          {selectedObjective ? (
            <OKRAlignmentView
              objectives={[selectedObjective]}
              onViewObjective={handleViewObjective}
            />
          ) : (
            <p className="text-muted-foreground">Select an objective to view details.</p>
          )}
        </div>
      </div>

      {user && (
        <CreateOKRDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onCreateOKR={handleCreateObjective}
          userId={user.id}
        />
      )}
    </div>
  );
}
