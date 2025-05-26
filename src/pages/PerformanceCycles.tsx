
import { useState } from "react";
import { useClerkAuth } from "@/context/ClerkAuthContext";
import { ReviewCycle, ReviewParameter } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import CycleManagement from "@/components/cycles/CycleManagement";
import { v4 as uuidv4 } from 'uuid';

export default function PerformanceCycles() {
  const { user } = useClerkAuth();
  const { toast } = useToast();
  
  // Start with empty cycles - these will be loaded from database
  const [cycles, setCycles] = useState<ReviewCycle[]>([]);
  
  const isAdmin = user?.role === "admin";
  
  // Only allow admin and managers to create cycles
  if (!isAdmin && user?.role !== "manager") {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold tracking-tight">Performance Cycles</h1>
        <p className="text-muted-foreground mt-2">
          You don't have permission to manage performance cycles.
        </p>
      </div>
    );
  }
  
  const handleCreateCycle = (newCycle: ReviewCycle) => {
    setCycles(prev => [...prev, newCycle]);
    toast({
      title: "Cycle created",
      description: `${newCycle.name} has been successfully created`,
    });
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Performance Cycles</h1>
        <p className="text-muted-foreground">
          Manage performance, goal, and feedback review cycles across the organization
        </p>
      </div>
      
      <CycleManagement 
        cycles={cycles}
        onCreateCycle={handleCreateCycle}
      />
    </div>
  );
}
