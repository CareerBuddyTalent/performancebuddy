
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, Settings, BarChart3, Calendar } from "lucide-react";

interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  status: 'active' | 'paused' | 'draft';
  lastRun: Date;
  totalRuns: number;
  successRate: number;
  nextScheduled?: Date;
}

const mockWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'New Employee Onboarding',
    description: 'Automatically creates onboarding tasks and schedules meetings for new hires',
    trigger: 'Employee Hired',
    status: 'active',
    lastRun: new Date('2024-01-15'),
    totalRuns: 23,
    successRate: 96,
    nextScheduled: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'Review Deadline Reminders',
    description: 'Sends reminder emails when performance review deadlines are approaching',
    trigger: 'Deadline Approaching',
    status: 'active',
    lastRun: new Date('2024-01-14'),
    totalRuns: 156,
    successRate: 98
  },
  {
    id: '3',
    name: 'Goal Update Notifications',
    description: 'Notifies managers when team members update their goals',
    trigger: 'Goal Updated',
    status: 'paused',
    lastRun: new Date('2024-01-10'),
    totalRuns: 89,
    successRate: 94
  }
];

export function ActiveWorkflows() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'active' ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Workflow Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">Total Workflows</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">2</div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">268</div>
            <p className="text-sm text-muted-foreground">Total Executions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">96%</div>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {mockWorkflows.map((workflow) => (
          <Card key={workflow.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(workflow.status)}
                    <h3 className="font-semibold text-lg">{workflow.name}</h3>
                    <Badge className={getStatusColor(workflow.status)}>
                      {workflow.status}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{workflow.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Trigger</p>
                      <p className="text-muted-foreground">{workflow.trigger}</p>
                    </div>
                    <div>
                      <p className="font-medium">Last Run</p>
                      <p className="text-muted-foreground">{workflow.lastRun.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-medium">Total Runs</p>
                      <p className="text-muted-foreground">{workflow.totalRuns}</p>
                    </div>
                    <div>
                      <p className="font-medium">Success Rate</p>
                      <p className="text-muted-foreground">{workflow.successRate}%</p>
                    </div>
                  </div>

                  {workflow.nextScheduled && (
                    <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Next scheduled: {workflow.nextScheduled.toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Switch checked={workflow.status === 'active'} />
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
