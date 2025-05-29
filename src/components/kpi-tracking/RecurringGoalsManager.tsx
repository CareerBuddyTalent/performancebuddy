
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Play, Pause } from 'lucide-react';
import { CreateRecurringGoalDialog } from './dialogs/CreateRecurringGoalDialog';
import { RecurringGoalTemplate } from '@/types/performance-management';

// Mock data for demonstration
const mockRecurringGoals: RecurringGoalTemplate[] = [
  {
    id: '1',
    title: 'Daily Sales Calls',
    description: 'Number of sales calls made per day',
    frequency: 'daily',
    target_value: 10,
    unit: 'calls',
    department: 'Sales',
    created_by: 'manager1',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '2',
    title: 'Weekly Code Reviews',
    description: 'Number of code reviews completed per week',
    frequency: 'weekly',
    target_value: 5,
    unit: 'reviews',
    department: 'Engineering',
    created_by: 'manager1',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
];

export function RecurringGoalsManager() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [recurringGoals] = useState<RecurringGoalTemplate[]>(mockRecurringGoals);

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'bg-blue-100 text-blue-800';
      case 'weekly': return 'bg-green-100 text-green-800';
      case 'monthly': return 'bg-purple-100 text-purple-800';
      case 'quarterly': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Recurring Goals</h2>
          <p className="text-muted-foreground">
            Manage templates for daily, weekly, and monthly recurring goals
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recurringGoals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                  <CardDescription>{goal.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {goal.is_active ? (
                    <Button variant="outline" size="sm">
                      <Pause className="h-3 w-3" />
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Play className="h-3 w-3" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className={getFrequencyColor(goal.frequency)}>
                    {goal.frequency}
                  </Badge>
                  <Badge variant={goal.is_active ? 'default' : 'secondary'}>
                    {goal.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Target</p>
                  <p className="text-sm text-muted-foreground">
                    {goal.target_value} {goal.unit}
                  </p>
                </div>

                {goal.department && (
                  <div>
                    <p className="text-sm font-medium">Department</p>
                    <p className="text-sm text-muted-foreground">{goal.department}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {recurringGoals.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Plus className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No recurring goals yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create templates for goals that repeat daily, weekly, or monthly.
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Template
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <CreateRecurringGoalDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
