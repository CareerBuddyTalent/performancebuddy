
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Clock, CheckCircle } from 'lucide-react';
import { usePerformanceManagement } from '@/hooks/usePerformanceManagement';

export function ReviewOrchestration() {
  const { reviewOrchestrations } = usePerformanceManagement();

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

  const getReviewTypeColor = (type: string) => {
    switch (type) {
      case '360': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'peer': return 'bg-green-100 text-green-800';
      case 'self': return 'bg-yellow-100 text-yellow-800';
      case 'upward': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">360° Review Orchestration</h2>
          <p className="text-muted-foreground">
            Manage multi-rater review processes and coordinate feedback collection
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Review
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reviews</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {reviewOrchestrations.filter(r => r.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reviewOrchestrations.filter(r => r.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">Finished reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">360° Reviews</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {reviewOrchestrations.filter(r => r.review_type === '360').length}
            </div>
            <p className="text-xs text-muted-foreground">Multi-rater reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Reviewer participation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {reviewOrchestrations.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Review Orchestrations</h3>
              <p className="text-muted-foreground text-center mb-4">
                Set up multi-rater review processes to gather comprehensive feedback from multiple perspectives.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Review
              </Button>
            </CardContent>
          </Card>
        ) : (
          reviewOrchestrations.map((review) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Review - {review.employee_id}
                    </CardTitle>
                    <CardDescription>
                      Orchestrated by {review.orchestrator_id}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getReviewTypeColor(review.review_type || '360')}>
                      {review.review_type || '360'}
                    </Badge>
                    <Badge className={getStatusColor(review.status)}>
                      {review.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="font-medium text-muted-foreground">Due Date</p>
                    <p>{review.due_date ? new Date(review.due_date).toLocaleDateString() : 'Not set'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Selection Method</p>
                    <p className="capitalize">{review.reviewer_selection_method}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Anonymity</p>
                    <p className="capitalize">{review.anonymity_level}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Assignments</p>
                    <p>{review.review_assignments?.length || 0}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Reviewers
                  </Button>
                  <Button variant="outline" size="sm">
                    View Progress
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
