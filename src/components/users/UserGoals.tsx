
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { Goal } from "@/types";

interface UserGoalsProps {
  userName: string;
  userGoals: Goal[];
  department?: string; // Add optional department prop
}

export default function UserGoals({ userName, userGoals, department }: UserGoalsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-1">
          <CardTitle>User Goals</CardTitle>
          <CardDescription>
            Current and completed goals for {userName}
            {department && (
              <span className="ml-1">
                • <span className="font-medium">{department}</span> Department
              </span>
            )}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {userGoals.length > 0 ? (
          <div className="space-y-4">
            {userGoals.map(goal => (
              <div key={goal.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{goal.title}</h3>
                  <Badge 
                    variant={goal.status === "completed" ? "default" : "outline"}
                    className="capitalize"
                  >
                    {goal.status.replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {goal.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span>Progress: {goal.progress}%</span>
                  <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <Target className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No goals found for this user</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
