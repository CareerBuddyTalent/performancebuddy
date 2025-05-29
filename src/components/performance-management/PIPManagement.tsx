
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Clock, AlertCircle, CheckCircle, Plus, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { usePerformanceManagement } from '@/hooks/usePerformanceManagement';

export function PIPManagement() {
  const { pipWorkflows, loading } = usePerformanceManagement();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = (workflow: any) => {
    if (!workflow.pip_milestones?.length) return 0;
    const completed = workflow.pip_milestones.filter((m: any) => m.status === 'completed').length;
    return (completed / workflow.pip_milestones.length) * 100;
  };

  const activePIPs = pipWorkflows.filter(p => p.status === 'active').length;
  const completedPIPs = pipWorkflows.filter(p => p.status === 'completed').length;
  const totalMilestones = pipWorkflows.reduce((acc, p) => acc + (p.pip_milestones?.length || 0), 0);
  const completedMilestones = pipWorkflows.reduce((acc, p) => 
    acc + (p.pip_milestones?.filter(m => m.status === 'completed').length || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Performance Improvement Plans</h2>
          <p className="text-muted-foreground">
            Manage structured improvement workflows for underperforming employees
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create PIP
        </Button>
      </div>

      {/* PIP Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active PIPs</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activePIPs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed PIPs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedPIPs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Milestones</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMilestones}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PIPs List */}
      <div className="space-y-4">
        {pipWorkflows.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No PIPs created yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create performance improvement plans to support struggling employees and track their progress.
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create PIP
              </Button>
            </CardContent>
          </Card>
        ) : (
          pipWorkflows.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      PIP - Employee {workflow.employee_id}
                    </CardTitle>
                    <CardDescription>
                      Manager: {workflow.manager_id}
                      {workflow.hr_partner_id && ` • HR Partner: ${workflow.hr_partner_id}`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(workflow.status)}>
                      {workflow.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Trigger Reason</p>
                    <p className="text-sm text-muted-foreground">{workflow.trigger_reason}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-sm text-muted-foreground">
                        {workflow.start_date ? format(new Date(workflow.start_date), 'PPP') : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">End Date</p>
                      <p className="text-sm text-muted-foreground">
                        {workflow.end_date ? format(new Date(workflow.end_date), 'PPP') : 'Not set'}
                      </p>
                    </div>
                  </div>

                  {workflow.status === 'active' && workflow.pip_milestones && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">Progress</p>
                        <p className="text-sm text-muted-foreground">
                          {Math.round(calculateProgress(workflow))}%
                        </p>
                      </div>
                      <Progress value={calculateProgress(workflow)} className="w-full" />
                    </div>
                  )}

                  {workflow.pip_milestones && workflow.pip_milestones.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Milestones</p>
                      <div className="space-y-2">
                        {workflow.pip_milestones.slice(0, 3).map((milestone: any) => (
                          <div key={milestone.id} className="flex items-center justify-between p-2 bg-muted rounded">
                            <div>
                              <p className="text-sm font-medium">{milestone.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {milestone.due_date ? `Due: ${format(new Date(milestone.due_date), 'PP')}` : 'No due date'}
                              </p>
                            </div>
                            <Badge className={getMilestoneStatusColor(milestone.status)} variant="outline">
                              {milestone.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        ))}
                        {workflow.pip_milestones.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{workflow.pip_milestones.length - 3} more milestones
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {workflow.expected_outcomes && workflow.expected_outcomes.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Expected Outcomes</p>
                      <ul className="list-disc list-inside space-y-1">
                        {workflow.expected_outcomes.slice(0, 2).map((outcome: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground">{outcome}</li>
                        ))}
                        {workflow.expected_outcomes.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{workflow.expected_outcomes.length - 2} more outcomes
                          </p>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
