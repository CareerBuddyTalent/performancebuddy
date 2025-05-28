import React, { useState } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { useClerkAuth } from "@/context/ClerkAuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, Calendar, TrendingUp } from "lucide-react";
import { useEnhancedGoalsData } from "@/hooks/useEnhancedGoalsData";
import GoalFormDialog from "@/components/performance/GoalFormDialog";
import { Goal } from "@/types";

export default function EmployeeGoals() {
  const { user } = useSupabaseAuth();
  const { goals, isLoading, createGoal, updateGoal } = useEnhancedGoalsData();
  const [showCreateGoal, setShowCreateGoal] = useState(false);

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Please log in to view your goals.</p>
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
            <p className="text-muted-foreground">Loading your goals...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateGoal = async (goal: Goal) => {
    try {
      await createGoal(goal);
      setShowCreateGoal(false);
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const activeGoals = goals.filter(g => g.status !== 'completed');
  const completedGoals = goals.filter(g => g.status === 'completed');
  const overallProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)
    : 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Goals</h1>
          <p className="text-muted-foreground">
            Track your personal and professional development goals
          </p>
        </div>
        <Button onClick={() => setShowCreateGoal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Goals</p>
              <p className="text-2xl font-bold">{goals.length}</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{activeGoals.length}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{completedGoals.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
              <p className="text-2xl font-bold">{overallProgress}%</p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-blue-600 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Active Goals</CardTitle>
        </CardHeader>
        <CardContent>
          {activeGoals.length === 0 ? (
            <div className="text-center py-8">
              <Target className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-muted-foreground">No active goals</h3>
              <p className="mt-1 text-sm text-muted-foreground">Get started by creating your first goal.</p>
              <div className="mt-6">
                <Button onClick={() => setShowCreateGoal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Goal
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {activeGoals.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                      )}
                    </div>
                    <Badge variant={
                      goal.status === 'completed' ? 'default' :
                      goal.status === 'in_progress' ? 'secondary' : 'outline'
                    }>
                      {goal.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="w-full" />
                  </div>
                  
                  {goal.dueDate && (
                    <div className="flex items-center text-sm text-muted-foreground mt-3">
                      <Calendar className="mr-1 h-4 w-4" />
                      Due: {goal.dueDate.toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedGoals.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-4 opacity-75">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                      )}
                    </div>
                    <Badge variant="default">Completed</Badge>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground mt-3">
                    <Calendar className="mr-1 h-4 w-4" />
                    Completed: {goal.updatedAt.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <GoalFormDialog
        open={showCreateGoal}
        onOpenChange={setShowCreateGoal}
        onSave={handleCreateGoal}
      />
    </div>
  );
}
