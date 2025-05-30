
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { usePerformanceManagement } from '@/hooks/usePerformanceManagement';

export function PIPManagement() {
  const { pipWorkflows } = usePerformanceManagement();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Performance Improvement Plans</h2>
          <p className="text-muted-foreground">
            Manage structured improvement plans for underperforming employees
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New PIP
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active PIPs</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {pipWorkflows.filter(p => p.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {pipWorkflows.filter(p => p.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {pipWorkflows.filter(p => 
                p.status === 'active' && p.end_date && new Date(p.end_date) < new Date()
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pipWorkflows.length > 0 
                ? Math.round((pipWorkflows.filter(p => p.status === 'completed').length / pipWorkflows.length) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Completion rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {pipWorkflows.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Performance Improvement Plans</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create structured improvement plans to help underperforming employees succeed.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create PIP
              </Button>
            </CardContent>
          </Card>
        ) : (
          pipWorkflows.map((pip) => (
            <Card key={pip.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      PIP - {pip.employee_id}
                    </CardTitle>
                    <CardDescription>
                      {pip.trigger_reason}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(pip.status)}>
                    {pip.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="font-medium text-muted-foreground">Manager</p>
                    <p>{pip.manager_id}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Start Date</p>
                    <p>{pip.start_date ? new Date(pip.start_date).toLocaleDateString() : 'Not started'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">End Date</p>
                    <p>{pip.end_date ? new Date(pip.end_date).toLocaleDateString() : 'Not set'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Milestones</p>
                    <p>{pip.pip_milestones?.length || 0}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    View Milestones
                  </Button>
                  <Button variant="outline" size="sm">
                    Update Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
