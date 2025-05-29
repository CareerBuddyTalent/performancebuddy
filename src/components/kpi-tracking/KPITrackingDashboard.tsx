
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { RecurringGoalsManager } from './RecurringGoalsManager';
import { KPIEntryDashboard } from './KPIEntryDashboard';
import { TeamKPIDashboard } from './TeamKPIDashboard';

export function KPITrackingDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">KPI Tracking</h1>
        <p className="text-muted-foreground">
          Track daily, weekly, and monthly performance indicators and goals
        </p>
      </div>

      <Tabs defaultValue="entry" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="entry">KPI Entry</TabsTrigger>
          <TabsTrigger value="recurring">Recurring Goals</TabsTrigger>
          <TabsTrigger value="team">Team Performance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="entry">
          <KPIEntryDashboard />
        </TabsContent>

        <TabsContent value="recurring">
          <RecurringGoalsManager />
        </TabsContent>

        <TabsContent value="team">
          <TeamKPIDashboard />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>KPI Analytics</CardTitle>
              <CardDescription>
                Advanced analytics and insights for your KPIs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced analytics features coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
