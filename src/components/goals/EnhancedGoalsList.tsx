
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Goal } from '@/types';
import { format } from 'date-fns';
import { Clock, User, Building2, Users, Target, CheckCircle2, CircleDashed } from 'lucide-react';

interface EnhancedGoalsListProps {
  goals: Goal[];
  title: string;
  showOwner?: boolean;
  emptyMessage: string;
}

export default function EnhancedGoalsList({ 
  goals, 
  title, 
  showOwner = false, 
  emptyMessage 
}: EnhancedGoalsListProps) {
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <CircleDashed className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'company':
        return <Building2 className="h-4 w-4" />;
      case 'team':
        return <Users className="h-4 w-4" />;
      case 'department':
        return <Users className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'company':
        return 'bg-rose-100 text-rose-700';
      case 'department':
        return 'bg-purple-100 text-purple-700';
      case 'team':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-sky-100 text-sky-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in_progress':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (goals.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground text-center max-w-md">
            {emptyMessage}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Badge variant="outline">{goals.length} goals</Badge>
      </div>

      <div className="grid gap-4">
        {goals.map((goal) => (
          <Card key={goal.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{goal.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {goal.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(goal.status)}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Progress</span>
                    <span className="font-bold">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>

                {/* Milestones */}
                {goal.milestones && goal.milestones.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span>
                        {goal.milestones.filter(m => m.status === 'completed').length} of {goal.milestones.length} milestones completed
                      </span>
                    </div>
                  </div>
                )}

                {/* Metrics */}
                {goal.metrics && goal.metrics.length > 0 && (
                  <div className="space-y-2">
                    {goal.metrics.slice(0, 2).map((metric, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{metric.name}</span>
                        <span className="font-medium">
                          {metric.current} / {metric.target} {metric.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags and Info */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                  <Badge variant="secondary" className={getLevelColor(goal.level)}>
                    <div className="flex items-center gap-1">
                      {getLevelIcon(goal.level)}
                      <span className="capitalize">{goal.level}</span>
                    </div>
                  </Badge>
                  
                  <Badge variant="outline" className={getStatusColor(goal.status)}>
                    {goal.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>

                  {goal.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                      <Clock className="h-3 w-3" />
                      <span>Due {format(new Date(goal.dueDate), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
