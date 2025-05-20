
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, List } from "lucide-react";
import ObjectiveCard from "./ObjectiveCard";
import { useState } from "react";
import { Objective } from "@/types/okr";

export default function CompanyObjectives() {
  // Sample company objectives - in a real app, these would come from an API
  const companyObjectives: any[] = [
    {
      id: "5",
      userId: "company",
      title: "Increase Revenue by 25%",
      description: "Grow company revenue through new product offerings and market expansion",
      status: "active" as const,
      progress: 60,
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
      level: "company" as const,
      createdAt: new Date("2024-12-15"),
      updatedAt: new Date("2025-05-01"),
      keyResults: [
        {
          id: "kr9",
          objectiveId: "5",
          title: "Launch 2 new product lines",
          type: "number" as const,
          currentValue: 1,
          targetValue: 2,
          startValue: 0,
          progress: 50,
          dueDate: new Date("2025-10-31"),
          status: "in_progress" as const
        },
        {
          id: "kr10",
          objectiveId: "5",
          title: "Expand to 3 new markets",
          type: "number" as const,
          currentValue: 2,
          targetValue: 3,
          startValue: 0,
          progress: 67,
          dueDate: new Date("2025-11-30"),
          status: "in_progress" as const
        }
      ]
    },
    {
      id: "6",
      userId: "company",
      title: "Improve Employee Satisfaction",
      description: "Enhance workplace culture and employee experience",
      status: "active" as const,
      progress: 80,
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
      level: "company" as const,
      createdAt: new Date("2024-12-15"),
      updatedAt: new Date("2025-05-10"),
      keyResults: [
        {
          id: "kr11",
          objectiveId: "6",
          title: "Increase employee satisfaction score to 4.5/5",
          type: "number" as const,
          currentValue: 4.2,
          targetValue: 4.5,
          startValue: 3.8,
          progress: 80,
          dueDate: new Date("2025-12-31"),
          status: "in_progress" as const
        },
        {
          id: "kr12",
          objectiveId: "6",
          title: "Implement 5 employee-suggested improvements",
          type: "number" as const,
          currentValue: 4,
          targetValue: 5,
          startValue: 0,
          progress: 80,
          dueDate: new Date("2025-09-30"),
          status: "in_progress" as const
        }
      ]
    }
  ];

  const handleAddKeyResult = (objectiveId: string) => {
    // In a real app, this would open a dialog to add a key result
    console.log("Add key result to", objectiveId);
  };

  const [view, setView] = useState<"card" | "list">("card");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Company Objectives</h2>
          <p className="text-sm text-muted-foreground">Track organization-wide goals</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={view === "card" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("card")}
          >
            <BarChart className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {companyObjectives.length > 0 ? (
        <div className="grid gap-6">
          {companyObjectives.map((objective) => (
            <ObjectiveCard
              key={objective.id}
              objective={objective}
              onView={() => console.log("View objective", objective.id)}
              onAddKeyResult={() => handleAddKeyResult(objective.id)}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No Company Objectives</CardTitle>
            <CardDescription>
              Company-level objectives will appear here
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button disabled>
              Only admins can create company objectives
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
