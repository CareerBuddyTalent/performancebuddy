
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TreePine, 
  Target, 
  Users, 
  TrendingUp, 
  Plus, 
  ChevronDown,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface CascadedGoal {
  id: string;
  title: string;
  description: string;
  level: 'company' | 'department' | 'team' | 'individual';
  parentId?: string;
  assignedTo?: string;
  progress: number;
  target: number;
  current: number;
  unit: string;
  dueDate: Date;
  status: 'on_track' | 'at_risk' | 'behind' | 'completed';
  children?: CascadedGoal[];
  weight: number; // Percentage of parent goal
}

const mockCascadedGoals: CascadedGoal[] = [
  {
    id: 'company-1',
    title: 'Increase Revenue by 25%',
    description: 'Company-wide revenue growth target for Q4',
    level: 'company',
    progress: 68,
    target: 1000000,
    current: 680000,
    unit: '$',
    dueDate: new Date('2024-12-31'),
    status: 'on_track',
    weight: 100,
    children: [
      {
        id: 'dept-1',
        title: 'Sales Department: 30% Revenue Increase',
        description: 'Sales team contribution to company revenue goal',
        level: 'department',
        parentId: 'company-1',
        progress: 72,
        target: 600000,
        current: 432000,
        unit: '$',
        dueDate: new Date('2024-12-31'),
        status: 'on_track',
        weight: 60,
        children: [
          {
            id: 'team-1',
            title: 'Enterprise Sales: $200K',
            description: 'Enterprise sales team revenue target',
            level: 'team',
            parentId: 'dept-1',
            progress: 75,
            target: 200000,
            current: 150000,
            unit: '$',
            dueDate: new Date('2024-12-31'),
            status: 'on_track',
            weight: 33,
            children: [
              {
                id: 'ind-1',
                title: 'Sarah Johnson: $50K',
                description: 'Individual sales target',
                level: 'individual',
                parentId: 'team-1',
                assignedTo: 'Sarah Johnson',
                progress: 80,
                target: 50000,
                current: 40000,
                unit: '$',
                dueDate: new Date('2024-12-31'),
                status: 'on_track',
                weight: 25
              }
            ]
          }
        ]
      },
      {
        id: 'dept-2',
        title: 'Product: 20% Feature Adoption',
        description: 'Increase feature adoption to drive revenue',
        level: 'department',
        parentId: 'company-1',
        progress: 45,
        target: 80,
        current: 36,
        unit: '%',
        dueDate: new Date('2024-12-31'),
        status: 'at_risk',
        weight: 40
      }
    ]
  }
];

export function TeamGoalCascading() {
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set(['company-1', 'dept-1']));
  const [selectedLevel, setSelectedLevel] = useState('all');

  const toggleExpanded = (goalId: string) => {
    const newExpanded = new Set(expandedGoals);
    if (newExpanded.has(goalId)) {
      newExpanded.delete(goalId);
    } else {
      newExpanded.add(goalId);
    }
    setExpandedGoals(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'bg-green-100 text-green-800';
      case 'at_risk': return 'bg-yellow-100 text-yellow-800';
      case 'behind': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'company': return <TreePine className="h-4 w-4 text-purple-600" />;
      case 'department': return <Users className="h-4 w-4 text-blue-600" />;
      case 'team': return <Target className="h-4 w-4 text-green-600" />;
      case 'individual': return <TrendingUp className="h-4 w-4 text-orange-600" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '$') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return `${value}${unit}`;
  };

  const renderGoal = (goal: CascadedGoal, depth: number = 0) => {
    const isExpanded = expandedGoals.has(goal.id);
    const hasChildren = goal.children && goal.children.length > 0;
    
    return (
      <div key={goal.id} className="space-y-2">
        <Card className={`ml-${depth * 4}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {hasChildren && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(goal.id)}
                    className="p-1 h-6 w-6"
                  >
                    {isExpanded ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                  </Button>
                )}
                
                <div className="flex items-center gap-2">
                  {getLevelIcon(goal.level)}
                  <div>
                    <h3 className="font-semibold text-sm">{goal.title}</h3>
                    <p className="text-xs text-muted-foreground">{goal.description}</p>
                    {goal.assignedTo && (
                      <p className="text-xs text-blue-600">Assigned to: {goal.assignedTo}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {formatValue(goal.current, goal.unit)} / {formatValue(goal.target, goal.unit)}
                    </span>
                    <Badge className={getStatusColor(goal.status)} variant="outline">
                      {goal.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={goal.progress} className="w-20 h-2" />
                    <span className="text-xs text-muted-foreground">{goal.progress}%</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="text-sm font-medium">{goal.weight}%</p>
                </div>
                
                {goal.status === 'at_risk' && (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {isExpanded && hasChildren && (
          <div className="ml-4 space-y-2">
            {goal.children!.map(child => renderGoal(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TreePine className="h-6 w-6" />
            Goal Cascading Workflow
          </h2>
          <p className="text-muted-foreground">
            Track how company goals cascade down through departments, teams, and individuals
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="department">Department</SelectItem>
              <SelectItem value="team">Team</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
            </SelectContent>
          </Select>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Goal
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Company Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-green-600">2 on track</span>
              <span className="text-xs text-muted-foreground">• 1 at risk</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Department Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-green-600">6 on track</span>
              <span className="text-xs text-muted-foreground">• 2 at risk</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Team Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-green-600">18 on track</span>
              <span className="text-xs text-muted-foreground">• 6 at risk</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Individual Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-green-600">128 on track</span>
              <span className="text-xs text-muted-foreground">• 28 at risk</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goal Hierarchy */}
      <Card>
        <CardHeader>
          <CardTitle>Goal Hierarchy</CardTitle>
          <CardDescription>
            View how goals cascade from company level down to individual contributors
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {mockCascadedGoals.map(goal => renderGoal(goal))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
