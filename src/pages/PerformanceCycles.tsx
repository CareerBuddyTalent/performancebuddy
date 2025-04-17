
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ReviewCycle, ReviewParameter } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import CycleManagement from "@/components/cycles/CycleManagement";
import { reviewCycles as mockCycles } from "@/data/mockData";
import { v4 as uuidv4 } from 'uuid';

export default function PerformanceCycles() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Convert legacy mock cycles to include the new parameter structure
  const [cycles, setCycles] = useState<ReviewCycle[]>(() => {
    return mockCycles.map(cycle => {
      // Create default parameters based on cycle purpose
      let defaultParams: ReviewParameter[] = [];
      
      if (cycle.name.includes("Performance") || cycle.name.includes("Annual")) {
        defaultParams = [
          {
            id: uuidv4(),
            name: "Job Knowledge",
            description: "Understanding of job-related skills and requirements",
            category: "performance",
            required: true,
            maxScore: 5
          },
          {
            id: uuidv4(),
            name: "Quality of Work",
            description: "Accuracy, thoroughness, and effectiveness of work performed",
            category: "performance",
            required: true,
            maxScore: 5
          }
        ];
      } else if (cycle.name.includes("Feedback")) {
        defaultParams = [
          {
            id: uuidv4(),
            name: "Strengths",
            description: "Areas where the employee excels",
            category: "custom",
            required: true,
            maxScore: 0
          },
          {
            id: uuidv4(),
            name: "Areas for Improvement",
            description: "Areas where the employee can improve",
            category: "custom",
            required: true,
            maxScore: 0
          }
        ];
      } else {
        defaultParams = [
          {
            id: uuidv4(),
            name: "Goal Progress",
            description: "Progress towards defined goals",
            category: "goals",
            required: true,
            maxScore: 5
          }
        ];
      }
      
      return {
        ...cycle,
        type: cycle.name.includes("Q") ? "quarterly" : 
              cycle.name.includes("Annual") ? "annual" : "monthly",
        purpose: cycle.name.includes("Performance") || cycle.name.includes("Annual") ? "performance" : 
                cycle.name.includes("Feedback") ? "feedback" : "goal",
        parameters: defaultParams
      };
    });
  });
  
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
