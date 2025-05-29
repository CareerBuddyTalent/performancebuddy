
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Clock, MessageSquare, CheckCircle, Plus, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { usePerformanceManagement } from '@/hooks/usePerformanceManagement';

export function ReviewOrchestration() {
  const { reviewOrchestrations, loading } = usePerformanceManagement();
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

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = (orchestration: any) => {
    if (!orchestration.review_assignments?.length) return 0;
    const completed = orchestration.review_assignments.filter((a: any) => a.status === 'completed').length;
    return (completed / orchestration.review_assignments.length) * 100;
  };

  const activeReviews = reviewOrchestrations.filter(r => r.status === 'active').length;
  const completedReviews = reviewOrchestrations.filter(r => r.status === 'completed').length;
  const totalAssignments = reviewOrchestrations.reduce((acc, r) => acc + (r.review_assignments?.length || 0), 0);
  const completedAssignments = reviewOrchestrations.reduce((acc, r) => 
    acc + (r.review_assignments?.filter(a => a.status === 'completed').length || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">360° Review Orchestration</h2>
          <p className="text-muted-foreground">
            Coordinate multi-rater feedback cycles and manage review workflows
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Review
        </Button>
      </div>

      {/* Review Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reviews</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeReviews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Reviews</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedReviews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssignments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviewOrchestrations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No 360° reviews yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create multi-rater review cycles to gather comprehensive feedback from peers, managers, and direct reports.
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Review
              </Button>
            </CardContent>
          </Card>
        ) : (
          reviewOrchestrations.map((orchestration) => (
            <Card key={orchestration.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {orchestration.review_type.toUpperCase()} Review - Employee {orchestration.employee_id}
                    </CardTitle>
                    <CardDescription>
                      Orchestrator: {orchestration.orchestrator_id}
                      {orchestration.review_cycle_id && ` • Cycle: ${orchestration.review_cycle_id}`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(orchestration.status)}>
                      {orchestration.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Review Type</p>
                      <p className="text-sm text-muted-foreground">{orchestration.review_type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Anonymity</p>
                      <p className="text-sm text-muted-foreground">{orchestration.anonymity_level}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Due Date</p>
                      <p className="text-sm text-muted-foreground">
                        {orchestration.due_date ? format(new Date(orchestration.due_date), 'PPP') : 'Not set'}
                      </p>
                    </div>
                  </div>

                  {orchestration.status === 'active' && orchestration.review_assignments && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">Progress</p>
                        <p className="text-sm text-muted-foreground">
                          {orchestration.review_assignments.filter((a: any) => a.status === 'completed').length} / {orchestration.review_assignments.length} completed
                        </p>
                      </div>
                      <Progress value={calculateProgress(orchestration)} className="w-full" />
                    </div>
                  )}

                  {orchestration.review_assignments && orchestration.review_assignments.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Reviewers</p>
                      <div className="space-y-2">
                        {orchestration.review_assignments.slice(0, 5).map((assignment: any) => (
                          <div key={assignment.id} className="flex items-center justify-between p-2 bg-muted rounded">
                            <div>
                              <p className="text-sm font-medium">
                                {assignment.reviewer_type.replace('_', ' ')} - {assignment.reviewer_id}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {assignment.invitation_sent_at 
                                  ? `Invited: ${format(new Date(assignment.invitation_sent_at), 'PP')}`
                                  : 'Not invited yet'
                                }
                                {assignment.reminder_count > 0 && ` • ${assignment.reminder_count} reminders`}
                              </p>
                            </div>
                            <Badge className={getAssignmentStatusColor(assignment.status)} variant="outline">
                              {assignment.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        ))}
                        {orchestration.review_assignments.length > 5 && (
                          <p className="text-xs text-muted-foreground">
                            +{orchestration.review_assignments.length - 5} more reviewers
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium mb-2">Selection Method</p>
                    <Badge variant="outline">
                      {orchestration.reviewer_selection_method}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
