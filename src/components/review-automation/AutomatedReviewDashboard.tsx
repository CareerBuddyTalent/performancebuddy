
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReviewCycleScheduler } from './ReviewCycleScheduler';
import { PerformanceDataAggregator } from './PerformanceDataAggregator';
import { ReviewOrchestration } from '../performance-management/ReviewOrchestration';

export function AutomatedReviewDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Automated Review System</h1>
        <p className="text-muted-foreground">
          Comprehensive automation for performance review cycles, data aggregation, and multi-rater orchestration
        </p>
      </div>

      <Tabs defaultValue="scheduler" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="scheduler">Review Scheduling</TabsTrigger>
          <TabsTrigger value="aggregation">Data Aggregation</TabsTrigger>
          <TabsTrigger value="orchestration">360° Orchestration</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduler">
          <ReviewCycleScheduler />
        </TabsContent>

        <TabsContent value="aggregation">
          <PerformanceDataAggregator />
        </TabsContent>

        <TabsContent value="orchestration">
          <ReviewOrchestration />
        </TabsContent>
      </Tabs>
    </div>
  );
}
