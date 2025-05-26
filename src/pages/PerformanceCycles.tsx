
import { useState } from "react";
import { useClerkAuth } from "@/context/ClerkAuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useRealReviewCycles } from "@/hooks/useRealReviewCycles";
import CycleManagement from "@/components/cycles/CycleManagement";

interface ReviewCycle {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'completed';
  parameters: any[];
  type: 'weekly' | 'monthly' | 'quarterly' | 'bi-annual' | 'annual';
  purpose: 'goal' | 'feedback' | 'performance';
}

export default function PerformanceCycles() {
  const { user } = useClerkAuth();
  const { toast } = useToast();
  const { reviewCycles, isLoading, createReviewCycle } = useRealReviewCycles();
  
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

  // Transform database cycles to match expected format
  const transformedCycles: ReviewCycle[] = reviewCycles.map(cycle => ({
    id: cycle.id,
    name: cycle.name,
    startDate: new Date(cycle.start_date),
    endDate: new Date(cycle.end_date),
    status: cycle.status as 'draft' | 'active' | 'completed',
    parameters: cycle.parameters || [],
    type: cycle.type as 'weekly' | 'monthly' | 'quarterly' | 'bi-annual' | 'annual',
    purpose: cycle.purpose as 'goal' | 'feedback' | 'performance'
  }));
  
  const handleCreateCycle = async (newCycleData: Omit<ReviewCycle, 'id'>) => {
    try {
      await createReviewCycle({
        name: newCycleData.name,
        start_date: newCycleData.startDate.toISOString(),
        end_date: newCycleData.endDate.toISOString(),
        status: newCycleData.status,
        type: newCycleData.type,
        purpose: newCycleData.purpose,
        parameters: newCycleData.parameters
      });

      toast({
        title: "Cycle created",
        description: `${newCycleData.name} has been successfully created`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create cycle. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-muted-foreground">Loading performance cycles...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Performance Cycles</h1>
        <p className="text-muted-foreground">
          Manage performance, goal, and feedback review cycles across the organization
        </p>
      </div>
      
      <CycleManagement 
        cycles={transformedCycles}
        onCreateCycle={handleCreateCycle}
      />
    </div>
  );
}
