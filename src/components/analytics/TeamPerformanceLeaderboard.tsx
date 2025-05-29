
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Award, TrendingUp, Users, Target } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  department: string;
  position: string;
  metrics: {
    salesCalls: number;
    codeReviews: number;
    customerSatisfaction: number;
    goalCompletion: number;
  };
  totalScore: number;
  rank: number;
  change: number; // Change in rank from last period
}

interface TeamAggregation {
  teamId: string;
  teamName: string;
  department: string;
  memberCount: number;
  averageScore: number;
  totalMetrics: {
    salesCalls: number;
    codeReviews: number;
    customerSatisfaction: number;
    goalCompletion: number;
  };
  topPerformer: string;
  improvement: number;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: '',
    department: 'Sales',
    position: 'Sales Manager',
    metrics: {
      salesCalls: 95,
      codeReviews: 0,
      customerSatisfaction: 98,
      goalCompletion: 92
    },
    totalScore: 95,
    rank: 1,
    change: 2
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: '',
    department: 'Engineering',
    position: 'Senior Developer',
    metrics: {
      salesCalls: 0,
      codeReviews: 89,
      customerSatisfaction: 85,
      goalCompletion: 88
    },
    totalScore: 87,
    rank: 2,
    change: -1
  },
  {
    id: '3',
    name: 'Emma Davis',
    avatar: '',
    department: 'Sales',
    position: 'Account Executive',
    metrics: {
      salesCalls: 87,
      codeReviews: 0,
      customerSatisfaction: 91,
      goalCompletion: 85
    },
    totalScore: 85,
    rank: 3,
    change: 0
  },
  {
    id: '4',
    name: 'John Smith',
    avatar: '',
    department: 'Engineering',
    position: 'Full Stack Developer',
    metrics: {
      salesCalls: 0,
      codeReviews: 82,
      customerSatisfaction: 88,
      goalCompletion: 79
    },
    totalScore: 83,
    rank: 4,
    change: 1
  }
];

const mockTeamAggregations: TeamAggregation[] = [
  {
    teamId: 'sales',
    teamName: 'Sales Team',
    department: 'Sales',
    memberCount: 8,
    averageScore: 88,
    totalMetrics: {
      salesCalls: 720,
      codeReviews: 0,
      customerSatisfaction: 92,
      goalCompletion: 85
    },
    topPerformer: 'Sarah Johnson',
    improvement: 12
  },
  {
    teamId: 'engineering',
    teamName: 'Engineering Team',
    department: 'Engineering',
    memberCount: 12,
    averageScore: 84,
    totalMetrics: {
      salesCalls: 0,
      codeReviews: 156,
      customerSatisfaction: 87,
      goalCompletion: 82
    },
    topPerformer: 'Mike Chen',
    improvement: 8
  }
];

export function TeamPerformanceLeaderboard() {
  const [selectedMetric, setSelectedMetric] = useState('totalScore');
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="h-5 w-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
    return <span className="text-gray-400">-</span>;
  };

  const getMetricValue = (member: TeamMember, metric: string) => {
    switch (metric) {
      case 'salesCalls': return member.metrics.salesCalls;
      case 'codeReviews': return member.metrics.codeReviews;
      case 'customerSatisfaction': return member.metrics.customerSatisfaction;
      case 'goalCompletion': return member.metrics.goalCompletion;
      default: return member.totalScore;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            Performance Leaderboard
          </h2>
          <p className="text-muted-foreground">
            Track top performers and team rankings
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="totalScore">Overall Score</SelectItem>
              <SelectItem value="salesCalls">Sales Calls</SelectItem>
              <SelectItem value="codeReviews">Code Reviews</SelectItem>
              <SelectItem value="customerSatisfaction">Customer Satisfaction</SelectItem>
              <SelectItem value="goalCompletion">Goal Completion</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="individual" className="space-y-4">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="individual">Individual Rankings</TabsTrigger>
          <TabsTrigger value="teams">Team Rankings</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          <div className="space-y-3">
            {mockTeamMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      {getRankIcon(member.rank)}
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {member.position} • {member.department}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold">
                              {getMetricValue(member, selectedMetric)}
                              {selectedMetric !== 'totalScore' && selectedMetric !== 'salesCalls' && selectedMetric !== 'codeReviews' ? '%' : ''}
                            </p>
                            <div className="flex items-center gap-1">
                              {getChangeIndicator(member.change)}
                              <span className="text-xs text-muted-foreground">
                                {Math.abs(member.change)} from last {selectedPeriod}
                              </span>
                            </div>
                          </div>
                          
                          <div className="w-24">
                            <Progress 
                              value={getMetricValue(member, selectedMetric)} 
                              className="h-2" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockTeamAggregations.map((team, index) => (
              <Card key={team.teamId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {team.teamName}
                      </CardTitle>
                      <CardDescription>
                        {team.memberCount} members • {team.department}
                      </CardDescription>
                    </div>
                    <Badge variant={index === 0 ? 'default' : 'outline'}>
                      #{index + 1}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Average Score</span>
                        <span className="text-2xl font-bold">{team.averageScore}%</span>
                      </div>
                      <Progress value={team.averageScore} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Top Performer</p>
                        <p className="font-medium">{team.topPerformer}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Improvement</p>
                        <p className="font-medium text-green-600">+{team.improvement}%</p>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {team.totalMetrics.salesCalls > 0 && (
                          <div>
                            <span className="text-muted-foreground">Sales Calls: </span>
                            <span className="font-medium">{team.totalMetrics.salesCalls}</span>
                          </div>
                        )}
                        {team.totalMetrics.codeReviews > 0 && (
                          <div>
                            <span className="text-muted-foreground">Code Reviews: </span>
                            <span className="font-medium">{team.totalMetrics.codeReviews}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground">Satisfaction: </span>
                          <span className="font-medium">{team.totalMetrics.customerSatisfaction}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Goals: </span>
                          <span className="font-medium">{team.totalMetrics.goalCompletion}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
