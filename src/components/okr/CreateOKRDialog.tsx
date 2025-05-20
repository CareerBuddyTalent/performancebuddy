
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Objective, createObjective } from "@/services/objectiveService";
import { useToast } from "@/hooks/use-toast";
import { OKRForm } from "./form/OKRForm";

interface CreateOKRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateOKR: (objective: Objective) => void;
  userId: string;
}

export default function CreateOKRDialog({ 
  open, 
  onOpenChange, 
  onCreateOKR, 
  userId 
}: CreateOKRDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCreateObjective = async (objective: Objective) => {
    try {
      setIsSubmitting(true);
      const createdObjective = await createObjective(objective);
      
      toast({
        title: "Success",
        description: "Objective created successfully"
      });
      
      onCreateOKR(createdObjective);
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create objective",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Objective</DialogTitle>
          <DialogDescription>
            Set a new objective and track your progress towards achieving it.
          </DialogDescription>
        </DialogHeader>
        
        <OKRForm 
          userId={userId}
          onSubmit={handleCreateObjective}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
