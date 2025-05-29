
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Target, TrendingUp, Plus } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

// Mock data for current active goals
const mockActiveGoals = [
  {
    id: '1',
    title: 'Daily Sales Calls',
    target: 10,
    current: 7,
    unit: 'calls',
    frequency: 'daily',
    deadline: new Date(),
    progress: 70
  },
  {
    id: '2',
    title: 'Weekly Code Reviews',
    target: 5,
    current: 3,
    unit: 'reviews',
    frequency: 'weekly',
    deadline: endOfWeek(new Date()),
    progress: 60
  },
  {
    id: '3',
    title: 'Monthly Client Meetings',
    target: 15,
    current: 12,
    unit: 'meetings',
    frequency: 'monthly',
    deadline: endOfMonth(new Date()),
    progress: 80
  }
];

export function KPIEntryDashboard() {
  const [activeGoals] = useState(mockActiveGoals);
  const [entryValues, setEntryValues] = useState<Record<string, string>>({});

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-blue-100 text-blue-800';
      case 'weekly': return 'bg-green-100 text-green-800';
      case 'monthly': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEntryChange = (goalId: string, value: string) => {
    setEntryValues(prev => ({ ...prev, [goalId]: value }));
  };

  const handleSubmitEntry = (goalId: string) => {
    const value = entryValues[goalId];
    if (value) {
      console.log(`Submitting entry for goal ${goalId}: ${value}`);
      // Here you would call your API to save the KPI entry
      setEntryValues(prev => ({ ...prev, [goalId]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Today's KPI Entry</h2>
        <p className="text-muted-foreground">
          Log progress on your active goals and KPIs
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Goals</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeGoals.filter(g => g.frequency === 'daily').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeGoals.filter(g => g.frequency === 'weekly').length}
            </div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Goals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeGoals.filter(g => g.frequency === 'monthly').length}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Active Goals</h3>
        {activeGoals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                  <CardDescription>
                    Due: {format(goal.deadline, 'MMM d, yyyy')}
                  </CardDescription>
                </div>
                <Badge className={getFrequencyColor(goal.frequency)}>
                  {goal.frequency}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                  </div>
                  <Progress value={goal.progress} className="w-full" />
                </div>

                {/* Quick Entry */}
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Label htmlFor={`entry-${goal.id}`}>Add Entry</Label>
                    <Input
                      id={`entry-${goal.id}`}
                      type="number"
                      placeholder={`Enter ${goal.unit}...`}
                      value={entryValues[goal.id] || ''}
                      onChange={(e) => handleEntryChange(goal.id, e.target.value)}
                    />
                  </div>
                  <Button onClick={() => handleSubmitEntry(goal.id)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {activeGoals.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No active goals</h3>
              <p className="text-muted-foreground text-center">
                Create some recurring goals to start tracking your KPIs.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
