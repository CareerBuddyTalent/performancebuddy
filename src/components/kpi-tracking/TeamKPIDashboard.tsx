
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Trophy, TrendingUp, Target } from 'lucide-react';

// Mock team performance data
const mockTeamData = {
  totalMembers: 8,
  activeGoals: 24,
  completionRate: 78,
  topPerformers: [
    { id: '1', name: 'Sarah Johnson', avatar: '', score: 95, goals: 4 },
    { id: '2', name: 'Mike Chen', avatar: '', score: 89, goals: 3 },
    { id: '3', name: 'Emma Davis', avatar: '', score: 87, goals: 5 }
  ],
  teamGoals: [
    {
      id: '1',
      title: 'Weekly Sales Targets',
      teamProgress: 85,
      individual: [
        { name: 'Sarah J.', progress: 95 },
        { name: 'Mike C.', progress: 82 },
        { name: 'Emma D.', progress: 79 },
        { name: 'John S.', progress: 88 }
      ]
    },
    {
      id: '2',
      title: 'Customer Support Response Time',
      teamProgress: 72,
      individual: [
        { name: 'Alice B.', progress: 89 },
        { name: 'Bob R.', progress: 65 },
        { name: 'Carol W.', progress: 78 },
        { name: 'David L.', progress: 56 }
      ]
    }
  ]
};

export function TeamKPIDashboard() {
  const [teamData] = useState(mockTeamData);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Team Performance</h2>
        <p className="text-muted-foreground">
          Track team-wide KPI performance and individual contributions
        </p>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamData.totalMembers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamData.activeGoals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamData.completionRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamData.topPerformers[0]?.name.split(' ')[0]}</div>
            <p className="text-xs text-muted-foreground">
              {teamData.topPerformers[0]?.score}% avg
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>
            Team members with highest KPI performance this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamData.topPerformers.map((performer, index) => (
              <div key={performer.id} className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Badge variant={index === 0 ? 'default' : 'outline'}>
                    #{index + 1}
                  </Badge>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={performer.avatar} />
                    <AvatarFallback>{performer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{performer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {performer.score}% • {performer.goals} goals
                    </p>
                  </div>
                  <Progress value={performer.score} className="h-2 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Goals Progress */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Team Goals Progress</h3>
        {teamData.teamGoals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{goal.title}</CardTitle>
                <Badge variant="outline">{goal.teamProgress}% Team Avg</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Team Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {goal.teamProgress}%
                    </span>
                  </div>
                  <Progress value={goal.teamProgress} className="w-full" />
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Individual Progress</p>
                  <div className="grid grid-cols-2 gap-2">
                    {goal.individual.map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{member.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">{member.progress}%</span>
                          <div className="w-16">
                            <Progress value={member.progress} className="h-1" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
