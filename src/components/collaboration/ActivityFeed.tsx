
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageSquare, Share2, Users, Target, Award, Calendar, Clock } from "lucide-react";
import { useState } from "react";

interface ActivityItem {
  id: string;
  type: 'goal_completed' | 'recognition_given' | 'review_submitted' | 'team_joined' | 'project_update' | 'milestone_reached';
  actor: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  target?: {
    id: string;
    name: string;
    type: 'user' | 'goal' | 'project' | 'team';
  };
  content: string;
  metadata?: any;
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'goal_completed',
    actor: {
      id: '1',
      name: 'Sarah Chen',
      avatar: '',
      role: 'Product Manager'
    },
    target: {
      id: 'goal-1',
      name: 'Q4 Product Launch',
      type: 'goal'
    },
    content: 'completed their quarterly goal "Q4 Product Launch" with 105% achievement rate!',
    metadata: { achievementRate: 105, goalType: 'quarterly' },
    timestamp: new Date('2024-01-15T10:30:00'),
    likes: 8,
    comments: 3,
    isLiked: false
  },
  {
    id: '2',
    type: 'recognition_given',
    actor: {
      id: '2',
      name: 'Mike Johnson',
      avatar: '',
      role: 'Engineering Lead'
    },
    target: {
      id: '3',
      name: 'Lisa Wang',
      type: 'user'
    },
    content: 'gave recognition to Lisa Wang for "Outstanding Code Quality" - helped the team ship bug-free features this sprint.',
    metadata: { recognitionType: 'achievement', points: 100 },
    timestamp: new Date('2024-01-15T09:15:00'),
    likes: 12,
    comments: 5,
    isLiked: true
  },
  {
    id: '3',
    type: 'milestone_reached',
    actor: {
      id: '4',
      name: 'Emma Davis',
      avatar: '',
      role: 'Marketing Manager'
    },
    content: 'reached a career milestone - 2 years with the company! 🎉',
    metadata: { milestoneType: 'anniversary', years: 2 },
    timestamp: new Date('2024-01-14T16:45:00'),
    likes: 15,
    comments: 8,
    isLiked: false
  },
  {
    id: '4',
    type: 'team_joined',
    actor: {
      id: '5',
      name: 'James Wilson',
      avatar: '',
      role: 'Content Creator'
    },
    target: {
      id: 'team-1',
      name: 'Marketing Campaign Team',
      type: 'team'
    },
    content: 'joined the Marketing Campaign Team',
    metadata: { teamSize: 6 },
    timestamp: new Date('2024-01-14T14:20:00'),
    likes: 4,
    comments: 2,
    isLiked: false
  },
  {
    id: '5',
    type: 'project_update',
    actor: {
      id: '1',
      name: 'Sarah Chen',
      avatar: '',
      role: 'Product Manager'
    },
    target: {
      id: 'project-1',
      name: 'User Dashboard Redesign',
      type: 'project'
    },
    content: 'updated project "User Dashboard Redesign" - 75% complete, on track for early delivery!',
    metadata: { progress: 75, status: 'on_track' },
    timestamp: new Date('2024-01-14T11:30:00'),
    likes: 6,
    comments: 1,
    isLiked: false
  }
];

export function ActivityFeed() {
  const [activities, setActivities] = useState(mockActivities);
  const [comment, setComment] = useState('');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'goal_completed': return <Target className="h-5 w-5 text-green-500" />;
      case 'recognition_given': return <Award className="h-5 w-5 text-yellow-500" />;
      case 'review_submitted': return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'team_joined': return <Users className="h-5 w-5 text-purple-500" />;
      case 'project_update': return <Calendar className="h-5 w-5 text-orange-500" />;
      case 'milestone_reached': return <Award className="h-5 w-5 text-pink-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityBadge = (activity: ActivityItem) => {
    switch (activity.type) {
      case 'goal_completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Goal Completed</Badge>;
      case 'recognition_given':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Recognition</Badge>;
      case 'milestone_reached':
        return <Badge variant="default" className="bg-pink-100 text-pink-800">Milestone</Badge>;
      case 'team_joined':
        return <Badge variant="secondary">Team Update</Badge>;
      case 'project_update':
        return <Badge variant="outline">Project</Badge>;
      default:
        return <Badge variant="outline">Activity</Badge>;
    }
  };

  const handleLike = (activityId: string) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === activityId 
          ? { 
              ...activity, 
              isLiked: !activity.isLiked,
              likes: activity.isLiked ? activity.likes - 1 : activity.likes + 1
            }
          : activity
      )
    );
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Activity Feed</h2>
          <p className="text-muted-foreground">Stay updated with team activities and achievements</p>
        </div>
      </div>

      {/* Post Something */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Input
                placeholder="Share an update with your team..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mb-3"
              />
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Target className="h-4 w-4 mr-2" />
                    Goal Update
                  </Button>
                  <Button variant="outline" size="sm">
                    <Award className="h-4 w-4 mr-2" />
                    Recognition
                  </Button>
                </div>
                <Button size="sm" disabled={!comment.trim()}>
                  Share
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Items */}
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activity.actor.avatar} />
                      <AvatarFallback>
                        {activity.actor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{activity.actor.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {activity.actor.role}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {activity.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getActivityBadge(activity)}
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                    </div>

                    {/* Special metadata display */}
                    {activity.metadata && (
                      <div className="mb-3 p-2 bg-muted rounded-md">
                        {activity.type === 'goal_completed' && (
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            <span className="text-sm">
                              Achievement: {activity.metadata.achievementRate}%
                            </span>
                          </div>
                        )}
                        {activity.type === 'recognition_given' && (
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            <span className="text-sm">
                              +{activity.metadata.points} points
                            </span>
                          </div>
                        )}
                        {activity.type === 'project_update' && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">
                              Progress: {activity.metadata.progress}% - {activity.metadata.status.replace('_', ' ')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(activity.id)}
                        className={activity.isLiked ? 'text-red-500' : ''}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${activity.isLiked ? 'fill-current' : ''}`} />
                        {activity.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {activity.comments}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {index < activities.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </div>
    </div>
  );
}
