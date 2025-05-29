
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, Users, Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { CalibrationManagement } from './CalibrationManagement';
import { SuccessionPlanning } from './SuccessionPlanning';
import { CompetencyManagement } from './CompetencyManagement';
import { PIPManagement } from './PIPManagement';
import { ReviewOrchestration } from './ReviewOrchestration';
import { usePerformanceManagement } from '@/hooks/usePerformanceManagement';

export function PerformanceManagementDashboard() {
  const {
    calibrationSessions,
    successionPlans,
    competencyFrameworks,
    pipWorkflows,
    reviewOrchestrations,
    loading
  } = usePerformanceManagement();

  // Calculate dashboard metrics
  const activeCalibrations = calibrationSessions.filter(s => s.status === 'in_progress' || s.status === 'scheduled').length;
  const criticalSuccessions = successionPlans.filter(p => p.succession_coverage < 2).length;
  const activePIPs = pipWorkflows.filter(p => p.status === 'active').length;
  const pendingReviews = reviewOrchestrations.filter(r => r.status === 'active').length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Performance Management</h1>
        <p className="text-muted-foreground">
          Advanced tools for calibration, succession planning, competency management, and performance workflows
        </p>
      </div>

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Calibrations</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCalibrations}</div>
            <p className="text-xs text-muted-foreground">
              Sessions in progress or scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Successions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{criticalSuccessions}</div>
            <p className="text-xs text-muted-foreground">
              Roles with insufficient coverage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active PIPs</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePIPs}</div>
            <p className="text-xs text-muted-foreground">
              Performance improvement plans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReviews}</div>
            <p className="text-xs text-muted-foreground">
              Multi-rater reviews in progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="calibration" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="calibration">Calibration</TabsTrigger>
          <TabsTrigger value="succession">Succession</TabsTrigger>
          <TabsTrigger value="competency">Competency</TabsTrigger>
          <TabsTrigger value="pip">PIPs</TabsTrigger>
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
    </div>
  );
}
