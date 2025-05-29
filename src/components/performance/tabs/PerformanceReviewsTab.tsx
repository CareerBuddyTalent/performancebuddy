
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User } from "lucide-react";

interface Review {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  reviewer: string;
  dueDate: string;
  type: 'self' | 'manager' | 'peer';
}

const mockReviews: Review[] = [
  {
    id: '1',
    title: 'Q4 2024 Performance Review',
    status: 'pending',
    reviewer: 'John Manager',
    dueDate: '2024-12-15',
    type: 'manager'
  },
  {
    id: '2',
    title: 'Self Assessment Q4 2024',
    status: 'in_progress',
    reviewer: 'Self',
    dueDate: '2024-12-10',
    type: 'self'
  },
  {
    id: '3',
    title: 'Peer Review - Project Alpha',
    status: 'completed',
    reviewer: 'Jane Colleague',
    dueDate: '2024-11-30',
    type: 'peer'
  }
];

export default function PerformanceReviewsTab() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'manager':
        return <User className="h-4 w-4" />;
      case 'self':
        return <Calendar className="h-4 w-4" />;
      case 'peer':
        return <Clock className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {mockReviews.map((review) => (
          <Card key={review.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{review.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    {getTypeIcon(review.type)}
                    Reviewer: {review.reviewer}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(review.status)}>
                  {review.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Due: {new Date(review.dueDate).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  {review.status === 'pending' && (
                    <Button size="sm">Start Review</Button>
                  )}
                  {review.status === 'in_progress' && (
                    <Button size="sm">Continue</Button>
                  )}
                  {review.status === 'completed' && (
                    <Button size="sm" variant="outline">View Results</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {mockReviews.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No Reviews Available</CardTitle>
            <CardDescription>
              There are no performance reviews assigned to you at this time.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
