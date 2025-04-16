
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ReviewCycle } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import CycleManagement from "@/components/cycles/CycleManagement";
import { reviewCycles as mockCycles } from "@/data/mockData";

export default function PerformanceCycles() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cycles, setCycles] = useState<ReviewCycle[]>(
    // Convert the mock cycles to include the new type and purpose properties
    mockCycles.map(cycle => ({
      ...cycle,
      type: cycle.name.includes("Q") ? "quarterly" : 
            cycle.name.includes("Annual") ? "annual" : "monthly",
      purpose: "performance" // Default all existing cycles to performance reviews
    }))
  );
  
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
