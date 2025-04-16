
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Import refactored components
import { PathCard } from "./career-paths/PathCard";
import { AddPathDialog } from "./career-paths/AddPathDialog";
import { AddRoleDialog } from "./career-paths/AddRoleDialog";
import { EmptyState } from "./career-paths/EmptyState";
import { LoadingState } from "./career-paths/LoadingState";
import { useCareerPaths } from "./career-paths/useCareerPaths";

export function CareerPaths() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  
  const {
    paths,
    isLoading,
    isSubmitting,
    selectedPathId,
    setSelectedPathId,
    handleAddPath,
    handleAddRole,
    handleRemovePath
  } = useCareerPaths();

  const openAddRoleDialog = (pathId: string) => {
    setSelectedPathId(pathId);
    setIsRoleDialogOpen(true);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <CardTitle>Career Development Paths</CardTitle>
          <CardDescription>View and manage career progression paths within the organization</CardDescription>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="mt-4 sm:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          Add Career Track
        </Button>
      </CardHeader>
      <CardContent>
        {paths.length === 0 ? (
          <EmptyState onAddPath={() => setIsDialogOpen(true)} />
        ) : (
          <div className="flex flex-col md:flex-row flex-wrap gap-8 py-4">
            {paths.map((path) => (
              <PathCard 
                key={path.id} 
                path={path} 
                onAddRole={openAddRoleDialog}
                onRemovePath={handleRemovePath}
              />
            ))}
          </div>
        )}
      </CardContent>

      {/* Dialog for adding a new career path */}
      <AddPathDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddPath={handleAddPath}
        isSubmitting={isSubmitting}
      />

      {/* Dialog for adding a new role to a career path */}
      <AddRoleDialog
        open={isRoleDialogOpen}
        onOpenChange={setIsRoleDialogOpen}
        onAddRole={handleAddRole}
        isSubmitting={isSubmitting}
      />
    </Card>
  );
}
