
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EnhancedGoalDialog } from "../performance-management/EnhancedGoalDialog";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { Goal } from "@/types";
import { toast } from "@/hooks/use-toast";

interface EnhancedCreateGoalButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export function EnhancedCreateGoalButton({ 
  variant = "default", 
  size = "default", 
  className,
  children = "Create Goal"
}: EnhancedCreateGoalButtonProps) {
  const { user } = useSupabaseAuth();
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);

  const handleGoalCreated = (goal: Goal) => {
    toast({
      title: "Success",
      description: "Goal created successfully",
    });
    console.log("New goal created:", goal);
  };

  return (
    <>
      <Button 
        variant={variant}
        size={size}
        className={className}
        onClick={() => setGoalDialogOpen(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        {children}
      </Button>

      <EnhancedGoalDialog
        open={goalDialogOpen}
        onOpenChange={setGoalDialogOpen}
        onGoalCreated={handleGoalCreated}
        userId={user?.id || ''}
      />
    </>
  );
}
