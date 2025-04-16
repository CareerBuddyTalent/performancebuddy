
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  onAddPath: () => void;
}

export function EmptyState({ onAddPath }: EmptyStateProps) {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground mb-4">No career paths found. Create your first career path.</p>
      <Button onClick={onAddPath}>
        <Plus className="mr-2 h-4 w-4" />
        Add Career Track
      </Button>
    </div>
  );
}
