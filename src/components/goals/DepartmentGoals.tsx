
import { useState } from "react";
import { Goal } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoalCard from "@/components/GoalCard";
import { User } from "@/types";

interface DepartmentGoalsProps {
  goals: Goal[];
  users: User[];
}

export default function DepartmentGoals({ goals, users }: DepartmentGoalsProps) {
  // Extract unique departments from users
  const departments = Array.from(
    new Set(users.filter(user => user.department).map(user => user.department))
  ) as string[];
  
  // Default to first department or "All" if no departments exist
  const [selectedDepartment, setSelectedDepartment] = useState<string | "all">(
    departments.length > 0 ? departments[0] : "all"
  );
  
  // Filter team goals (those with level 'team' or 'department')
  const teamGoals = goals.filter(
    goal => goal.level === "team" || goal.level === "department"
  );
  
  // Get department for a goal by looking up the user's department
  const getGoalDepartment = (goal: Goal): string | undefined => {
    const user = users.find(u => u.id === goal.userId);
    return user?.department;
  };
  
  // Filter goals by selected department
  const filteredGoals = selectedDepartment === "all"
    ? teamGoals
    : teamGoals.filter(goal => {
        const department = getGoalDepartment(goal);
        return department === selectedDepartment || goal.alignedWith === selectedDepartment;
      });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Goals by Department</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue={selectedDepartment.toString()} 
          onValueChange={(value) => setSelectedDepartment(value as string | "all")}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Departments</TabsTrigger>
            {departments.map(department => (
              <TabsTrigger key={department} value={department}>
                {department}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {departments.map(department => {
              const departmentGoals = teamGoals.filter(
                goal => getGoalDepartment(goal) === department || goal.alignedWith === department
              );
              
              return departmentGoals.length > 0 ? (
                <div key={department} className="mb-6">
                  <h3 className="text-lg font-medium mb-3">{department}</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {departmentGoals.map(goal => (
                      <GoalCard key={goal.id} goal={goal} />
                    ))}
                  </div>
                </div>
              ) : null;
            })}
            
            {/* Show goals without department */}
            {teamGoals.filter(goal => !getGoalDepartment(goal) && !goal.alignedWith).length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Unassigned</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {teamGoals
                    .filter(goal => !getGoalDepartment(goal) && !goal.alignedWith)
                    .map(goal => (
                      <GoalCard key={goal.id} goal={goal} />
                    ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          {departments.map(department => (
            <TabsContent key={department} value={department} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredGoals
                  .filter(goal => getGoalDepartment(goal) === department || goal.alignedWith === department)
                  .map(goal => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
              </div>
              
              {filteredGoals.filter(goal => 
                getGoalDepartment(goal) === department || goal.alignedWith === department
              ).length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No team goals found for this department.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
