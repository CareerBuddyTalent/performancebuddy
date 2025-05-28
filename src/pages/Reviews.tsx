import React, { useState } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Calendar, TrendingUp, User } from "lucide-react";
import { useRealPerformanceData } from "@/hooks/useRealPerformanceData";

export default function Reviews() {
  const { user } = useSupabaseAuth();
  const { reviews, isLoading } = useRealPerformanceData();

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Please log in to view reviews.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Loading reviews...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userReviews = reviews.filter(r => r.employee_id === user.id);
  const pendingReviews = userReviews.filter(r => r.status === 'pending');
  const completedReviews = userReviews.filter(r => r.status === 'completed');
  const draftReviews = userReviews.filter(r => r.status === 'draft');

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Performance Reviews</h1>
          <p className="text-muted-foreground">
            View and manage your performance reviews
          </p>
        </div>
        {(user.role === 'admin' || user.role === 'manager') && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Review
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
              <p className="text-2xl font-bold">{userReviews.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{pendingReviews.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{completedReviews.length}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Score</p>
              <p className="text-2xl font-bold">
                {completedReviews.length > 0 
                  ? Math.round(completedReviews.reduce((sum, r) => sum + (r.overall_score || 0), 0) / completedReviews.length * 10) / 10
                  : 'N/A'
                }
              </p>
            </div>
            <User className="h-8 w-8 text-purple-600" />
          </CardContent>
        </Card>
      </div>

      {/* Reviews Tabs */}
      <Card>
        <Tabs defaultValue="pending" className="p-6">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingReviews.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedReviews.length})</TabsTrigger>
            <TabsTrigger value="drafts">Drafts ({draftReviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <div className="space-y-4">
              {pendingReviews.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold text-muted-foreground">No pending reviews</h3>
                  <p className="mt-1 text-sm text-muted-foreground">You have no reviews waiting for completion.</p>
                </div>
              ) : (
                pendingReviews.map((review) => (
                  <Card key={review.id} className="border-orange-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{review.review_type} Review</CardTitle>
                          <CardDescription>
                            Started: {new Date(review.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          Complete your review to get feedback on your performance.
                        </p>
                        <Button size="sm">Complete Review</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="space-y-4">
              {completedReviews.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold text-muted-foreground">No completed reviews</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Your completed reviews will appear here.</p>
                </div>
              ) : (
                completedReviews.map((review) => (
                  <Card key={review.id} className="border-green-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{review.review_type} Review</CardTitle>
                          <CardDescription>
                            Completed: {new Date(review.updated_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          {review.overall_score && (
                            <Badge variant="outline">
                              Score: {review.overall_score}/5
                            </Badge>
                          )}
                          <Badge variant="default">Completed</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {review.strengths && (
                          <div>
                            <h4 className="font-medium text-sm">Strengths:</h4>
                            <p className="text-sm text-muted-foreground">{review.strengths}</p>
                          </div>
                        )}
                        {review.areas_for_improvement && (
                          <div>
                            <h4 className="font-medium text-sm">Areas for Improvement:</h4>
                            <p className="text-sm text-muted-foreground">{review.areas_for_improvement}</p>
                          </div>
                        )}
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="drafts" className="mt-6">
            <div className="space-y-4">
              {draftReviews.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold text-muted-foreground">No draft reviews</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Your draft reviews will appear here.</p>
                </div>
              ) : (
                draftReviews.map((review) => (
                  <Card key={review.id} className="border-gray-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{review.review_type} Review</CardTitle>
                          <CardDescription>
                            Last saved: {new Date(review.updated_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">Draft</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          Continue working on this review.
                        </p>
                        <Button size="sm">Continue</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
