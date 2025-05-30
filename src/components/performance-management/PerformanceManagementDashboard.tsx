
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Target, Users, TrendingUp, Award, FileText } from 'lucide-react';
import { CalibrationManagement } from './CalibrationManagement';
import { SuccessionPlanning } from './SuccessionPlanning';
import { CompetencyManagement } from './CompetencyManagement';
import { PIPManagement } from './PIPManagement';
import { ReviewOrchestration } from './ReviewOrchestration';
import { EnhancedGoalDialog } from './EnhancedGoalDialog';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { Goal } from '@/types';
import { toast } from '@/hooks/use-toast';

export function PerformanceManagementDashboard() {
  const { user } = useSupabaseAuth();
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);

  const handleGoalCreated = (goal: Goal) => {
    toast({
      title: "Success",
      description: "Goal created successfully",
    });
    console.log("New goal created:", goal);
  };

  const statsCards = [
    {
      title: "Active Goals",
      value: "127",
      change: "+12%",
      icon: Target,
      color: "text-blue-600",
    },
    {
      title: "Performance Reviews",
      value: "89",
      change: "+8%",
      icon: FileText,
      color: "text-green-600",
    },
    {
      title: "Team Members",
      value: "45",
      change: "+3%",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Avg Performance",
      value: "4.2",
      change: "+0.3",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Performance Management</h1>
          <p className="text-muted-foreground">
            Manage team performance, goals, and development plans
          </p>
        </div>
        <Button onClick={() => setGoalDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Goal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="calibration" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="calibration">Calibration</TabsTrigger>
          <TabsTrigger value="succession">Succession</TabsTrigger>
          <TabsTrigger value="competency">Competency</TabsTrigger>
          <TabsTrigger value="pip">PIP</TabsTrigger>
          <TabsTrigger value="reviews">360° Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="calibration">
          <CalibrationManagement />
        </TabsContent>

        <TabsContent value="succession">
          <SuccessionPlanning />
        </TabsContent>

        <TabsContent value="competency">
          <CompetencyManagement />
        </TabsContent>

        <TabsContent value="pip">
          <PIPManagement />
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewOrchestration />
        </TabsContent>
      </Tabs>

      <EnhancedGoalDialog
        open={goalDialogOpen}
        onOpenChange={setGoalDialogOpen}
        onGoalCreated={handleGoalCreated}
        userId={user?.id || ''}
      />
    </div>
  );
}
