
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Users, Settings, Play, Pause, RotateCcw } from 'lucide-react';
import { format, addDays, addWeeks, addMonths, addQuarters } from 'date-fns';

interface ReviewCycle {
  id: string;
  name: string;
  type: 'annual' | 'quarterly' | 'monthly' | 'project_based';
  frequency: 'once' | 'recurring';
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  startDate: Date;
  endDate: Date;
  participants: string[];
  reviewTypes: string[];
  automationSettings: {
    autoReminders: boolean;
    reminderDays: number[];
    autoEscalation: boolean;
    escalationDays: number;
    autoComplete: boolean;
  };
  progress: {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
  };
  nextOccurrence?: Date;
}

const mockReviewCycles: ReviewCycle[] = [
  {
    id: '1',
    name: 'Q4 2024 Performance Reviews',
    type: 'quarterly',
    frequency: 'recurring',
    status: 'active',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-31'),
    participants: ['all'],
    reviewTypes: ['self', 'manager', 'peer'],
    automationSettings: {
      autoReminders: true,
      reminderDays: [7, 3, 1],
      autoEscalation: true,
      escalationDays: 2,
      autoComplete: false
    },
    progress: {
      total: 45,
      completed: 12,
      inProgress: 18,
      notStarted: 15
    },
    nextOccurrence: new Date('2025-03-01')
  },
  {
    id: '2',
    name: 'Annual Leadership 360 Reviews',
    type: 'annual',
    frequency: 'recurring',
    status: 'scheduled',
    startDate: new Date('2025-01-15'),
    endDate: new Date('2025-02-15'),
    participants: ['managers', 'directors'],
    reviewTypes: ['360', 'self', 'upward'],
    automationSettings: {
      autoReminders: true,
      reminderDays: [14, 7, 3, 1],
      autoEscalation: true,
      escalationDays: 3,
      autoComplete: false
    },
    progress: {
      total: 8,
      completed: 0,
      inProgress: 0,
      notStarted: 8
    }
  }
];

export function ReviewCycleScheduler() {
  const [cycles, setCycles] = useState<ReviewCycle[]>(mockReviewCycles);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<ReviewCycle | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = (progress: ReviewCycle['progress']) => {
    return progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
  };

  const getNextOccurrence = (cycle: ReviewCycle) => {
    if (cycle.frequency === 'once') return null;
    
    const baseDate = new Date();
    switch (cycle.type) {
      case 'quarterly': return addQuarters(baseDate, 1);
      case 'monthly': return addMonths(baseDate, 1);
      case 'annual': return addQuarters(baseDate, 4);
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Review Cycle Scheduler</h2>
          <p className="text-muted-foreground">
            Automate and schedule performance review cycles with intelligent orchestration
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule New Cycle
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cycles</CardTitle>
            <Play className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {cycles.filter(c => c.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {cycles.filter(c => c.status === 'scheduled').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cycles.reduce((acc, c) => acc + c.progress.total, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {cycles.length > 0 
                ? Math.round((cycles.reduce((acc, c) => acc + c.progress.completed, 0) / 
                   cycles.reduce((acc, c) => acc + c.progress.total, 0)) * 100)
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Review Cycles List */}
      <div className="space-y-4">
        {cycles.map((cycle) => (
          <Card key={cycle.id} className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedCycle(cycle)}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{cycle.name}</CardTitle>
                  <CardDescription>
                    {format(cycle.startDate, 'PPP')} - {format(cycle.endDate, 'PPP')}
                    {cycle.nextOccurrence && (
                      <span className="ml-2 text-blue-600">
                        • Next: {format(cycle.nextOccurrence, 'PPP')}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(cycle.status)}>
                    {cycle.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium">Type & Frequency</p>
                    <p className="text-sm text-muted-foreground">
                      {cycle.type} • {cycle.frequency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Review Types</p>
                    <div className="flex gap-1 mt-1">
                      {cycle.reviewTypes.map((type, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Automation</p>
                    <p className="text-sm text-muted-foreground">
                      {cycle.automationSettings.autoReminders ? 'Auto reminders' : 'Manual'} • 
                      {cycle.automationSettings.autoEscalation ? ' Auto escalation' : ' Manual escalation'}
                    </p>
                  </div>
                </div>

                {cycle.status === 'active' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">Progress</p>
                      <p className="text-sm text-muted-foreground">
                        {cycle.progress.completed} / {cycle.progress.total} completed
                      </p>
                    </div>
                    <Progress value={calculateProgress(cycle.progress)} className="w-full" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{cycle.progress.completed} Completed</span>
                      <span>{cycle.progress.inProgress} In Progress</span>
                      <span>{cycle.progress.notStarted} Not Started</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {cycles.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No review cycles scheduled</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create automated review cycles to streamline your performance management process.
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule First Cycle
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
