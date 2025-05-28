import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import PerformanceGoalsTab from "@/components/performance/tabs/PerformanceGoalsTab";
import PerformanceReviewsTab from "@/components/performance/tabs/PerformanceReviewsTab";
import { Goal } from "@/types";

export default function Performance() {
  const { user } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState("goals");
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    // Fetch goals from database or use a default set
    // Example: fetchGoals().then(setGoals);
  }, []);

  const handleAddGoal = (goal: Goal) => {
    setGoals([...goals, goal]);
  };

  const handleUpdateGoal = (updatedGoal: Goal) => {
    setGoals(goals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal));
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Performance</h1>
        <p className="text-muted-foreground">
          Track and manage your performance and development
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>
            Review your goals, feedback, and progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex flex-row items-center justify-between space-y-0 p-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Goals
                  </div>
                  <div className="text-2xl font-bold">
                    {goals.length}
                  </div>
                </div>
                {/* Placeholder for Goal Icon */}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-row items-center justify-between space-y-0 p-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Reviews
                  </div>
                  <div className="text-2xl font-bold">
                    3
                  </div>
                </div>
                {/* Placeholder for Review Icon */}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-row items-center justify-between space-y-0 p-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Skills
                  </div>
                  <div className="text-2xl font-bold">
                    12
                  </div>
                </div>
                {/* Placeholder for Skills Icon */}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-row items-center justify-between space-y-0 p-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Progress
                  </div>
                  <div className="text-2xl font-bold">
                    75%
                  </div>
                </div>
                {/* Placeholder for Progress Icon */}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="goals" className="space-y-6">
          <PerformanceGoalsTab
            goals={goals}
            onAddGoal={handleAddGoal}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        </TabsContent>
        <TabsContent value="reviews" className="space-y-6">
          <PerformanceReviewsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
