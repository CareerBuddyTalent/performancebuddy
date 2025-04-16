
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skill, DevelopmentPlan } from "@/types";
import { Target, Plus } from "lucide-react";

interface DevelopmentPlansProps {
  plans: DevelopmentPlan[];
  skills: Skill[];
  onOpenCreatePlanDialog: () => void;
}

export function DevelopmentPlans({ plans, skills, onOpenCreatePlanDialog }: DevelopmentPlansProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill-Based Development Plans</CardTitle>
        <CardDescription>Create and manage development plans to address skill gaps</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map(plan => (
            <Card key={plan.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{plan.title}</CardTitle>
                <CardDescription>
                  Created: {plan.createdAt.toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Target Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {plan.skills.map(skillId => {
                        const skill = skills.find(s => s.id === skillId);
                        return skill ? (
                          <Badge key={skillId} variant="secondary">
                            {skill.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Objectives</h4>
                    <ScrollArea className="h-32">
                      {plan.objectives.length > 0 ? (
                        <ul className="space-y-2">
                          {plan.objectives.map(objective => (
                            <li key={objective.id} className="flex items-start gap-2">
                              <div className={`w-2 h-2 rounded-full mt-1.5 ${
                                objective.status === 'completed' 
                                  ? 'bg-green-500' 
                                  : objective.status === 'in_progress' 
                                    ? 'bg-amber-500' 
                                    : 'bg-gray-300'
                              }`} />
                              <div>
                                <p className="text-sm">{objective.description}</p>
                                <p className="text-xs text-muted-foreground">
                                  Due: {objective.dueDate.toLocaleDateString()}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No objectives added yet.</p>
                      )}
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
              <div className="px-6 py-3 bg-muted/50 flex justify-end">
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </Card>
          ))}
          
          <div 
            className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-60 cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={onOpenCreatePlanDialog}
          >
            <Target className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Create New Plan</h3>
            <p className="text-sm text-muted-foreground text-center mt-1 mb-4">
              Set skill development goals for your team members
            </p>
            <Button variant="outline" onClick={onOpenCreatePlanDialog}>
              <Plus className="mr-2 h-4 w-4" />
              New Development Plan
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
