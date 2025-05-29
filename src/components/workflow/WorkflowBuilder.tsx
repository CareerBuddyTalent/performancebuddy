
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Settings, Trash2, Play, ArrowRight } from "lucide-react";
import { useState } from "react";

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'condition' | 'action';
  name: string;
  config: Record<string, any>;
}

const stepTypes = [
  { value: 'email', label: 'Send Email', type: 'action' },
  { value: 'notification', label: 'Send Notification', type: 'action' },
  { value: 'assign_task', label: 'Assign Task', type: 'action' },
  { value: 'update_status', label: 'Update Status', type: 'action' },
  { value: 'schedule_meeting', label: 'Schedule Meeting', type: 'action' },
  { value: 'if_condition', label: 'If Condition', type: 'condition' },
  { value: 'delay', label: 'Wait/Delay', type: 'action' }
];

const triggerTypes = [
  { value: 'review_submitted', label: 'Review Submitted' },
  { value: 'goal_updated', label: 'Goal Updated' },
  { value: 'employee_hired', label: 'Employee Hired' },
  { value: 'deadline_approaching', label: 'Deadline Approaching' },
  { value: 'performance_score', label: 'Performance Score Changed' }
];

export function WorkflowBuilder() {
  const [workflowName, setWorkflowName] = useState('');
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [steps, setSteps] = useState<WorkflowStep[]>([]);

  const addStep = (stepType: string) => {
    const newStep: WorkflowStep = {
      id: Math.random().toString(36).substr(2, 9),
      type: stepTypes.find(s => s.value === stepType)?.type as any || 'action',
      name: stepTypes.find(s => s.value === stepType)?.label || stepType,
      config: {}
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (stepId: string) => {
    setSteps(steps.filter(s => s.id !== stepId));
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'trigger': return <Play className="h-4 w-4" />;
      case 'condition': return <Settings className="h-4 w-4" />;
      default: return <ArrowRight className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Workflow</CardTitle>
          <CardDescription>
            Build custom automation workflows with triggers, conditions, and actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Workflow Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workflow-name">Workflow Name</Label>
              <Input
                id="workflow-name"
                placeholder="Enter workflow name..."
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Trigger Event</Label>
              <Select value={selectedTrigger} onValueChange={setSelectedTrigger}>
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger..." />
                </SelectTrigger>
                <SelectContent>
                  {triggerTypes.map((trigger) => (
                    <SelectItem key={trigger.value} value={trigger.value}>
                      {trigger.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Workflow Steps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Workflow Steps</h3>
              <div className="flex gap-2">
                {stepTypes.map((stepType) => (
                  <Button
                    key={stepType.value}
                    variant="outline"
                    size="sm"
                    onClick={() => addStep(stepType.value)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {stepType.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Trigger Display */}
            {selectedTrigger && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <Play className="h-5 w-5 text-blue-600" />
                <div>
                  <Badge variant="outline" className="mb-1">Trigger</Badge>
                  <p className="font-medium">
                    {triggerTypes.find(t => t.value === selectedTrigger)?.label}
                  </p>
                </div>
              </div>
            )}

            {/* Steps List */}
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3 p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  {getStepIcon(step.type)}
                  <span className="text-sm font-medium">Step {index + 1}</span>
                </div>
                <div className="flex-1">
                  <Badge 
                    variant={step.type === 'condition' ? 'secondary' : 'default'}
                    className="mb-1"
                  >
                    {step.type}
                  </Badge>
                  <p className="font-medium">{step.name}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeStep(step.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {steps.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Add steps to build your workflow</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button className="flex-1">Save Workflow</Button>
            <Button variant="outline">Test Workflow</Button>
            <Button variant="outline">Save as Template</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
