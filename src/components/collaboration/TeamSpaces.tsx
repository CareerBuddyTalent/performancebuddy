
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Calendar, Target, MessageSquare } from "lucide-react";
import { useState } from "react";

interface TeamSpace {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  projects: Project[];
  progress: number;
  status: 'active' | 'planning' | 'completed';
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
}

interface Project {
  id: string;
  name: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed';
  progress: number;
  dueDate: Date;
  assignees: string[];
}

const mockTeamSpaces: TeamSpace[] = [
  {
    id: '1',
    name: 'Product Development',
    description: 'Cross-functional team working on new product features',
    members: [
      { id: '1', name: 'Sarah Chen', role: 'Product Manager', status: 'online' },
      { id: '2', name: 'Mike Johnson', role: 'Developer', status: 'online' },
      { id: '3', name: 'Lisa Wang', role: 'Designer', status: 'away' }
    ],
    projects: [
      {
        id: '1',
        name: 'User Dashboard Redesign',
        status: 'in_progress',
        progress: 75,
        dueDate: new Date('2024-02-15'),
        assignees: ['1', '2', '3']
      },
      {
        id: '2',
        name: 'Mobile App Beta',
        status: 'planning',
        progress: 20,
        dueDate: new Date('2024-03-01'),
        assignees: ['2']
      }
    ],
    progress: 68,
    status: 'active'
  },
  {
    id: '2',
    name: 'Marketing Campaign',
    description: 'Q1 marketing initiatives and campaigns',
    members: [
      { id: '4', name: 'Emma Davis', role: 'Marketing Manager', status: 'online' },
      { id: '5', name: 'James Wilson', role: 'Content Creator', status: 'offline' }
    ],
    projects: [
      {
        id: '3',
        name: 'Social Media Strategy',
        status: 'review',
        progress: 90,
        dueDate: new Date('2024-01-30'),
        assignees: ['4', '5']
      }
    ],
    progress: 85,
    status: 'active'
  }
];

export function TeamSpaces() {
  const [selectedSpace, setSelectedSpace] = useState<TeamSpace | null>(mockTeamSpaces[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'planning': return 'secondary';
      case 'completed': return 'outline';
      default: return 'secondary';
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'review': return 'text-orange-600';
      case 'planning': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getOnlineStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Team Spaces List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Team Spaces</h3>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Space
          </Button>
        </div>
        
        <Input
          placeholder="Search spaces..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="space-y-2">
          {mockTeamSpaces.map((space) => (
            <Card 
              key={space.id} 
              className={`cursor-pointer transition-colors ${
                selectedSpace?.id === space.id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
              }`}
              onClick={() => setSelectedSpace(space)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{space.name}</h4>
                  <Badge variant={getStatusColor(space.status) as any}>
                    {space.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{space.description}</p>
                
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{space.members.length} members</span>
                  <Target className="h-4 w-4 text-muted-foreground ml-2" />
                  <span className="text-sm">{space.projects.length} projects</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{space.progress}%</span>
                  </div>
                  <Progress value={space.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Selected Space Details */}
      <div className="lg:col-span-2">
        {selectedSpace ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {selectedSpace.name}
                  </CardTitle>
                  <CardDescription>{selectedSpace.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="projects" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="members">Members</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
                
                <TabsContent value="projects" className="space-y-4">
                  {selectedSpace.projects.map((project) => (
                    <Card key={project.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{project.name}</h4>
                            <p className={`text-sm capitalize ${getProjectStatusColor(project.status)}`}>
                              {project.status.replace('_', ' ')}
                            </p>
                          </div>
                          <Badge variant="outline">
                            Due {project.dueDate.toLocaleDateString()}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>
                        
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-sm text-muted-foreground">Assigned to:</span>
                          <div className="flex -space-x-2">
                            {project.assignees.map((assigneeId) => {
                              const member = selectedSpace.members.find(m => m.id === assigneeId);
                              return member ? (
                                <Avatar key={assigneeId} className="h-6 w-6 border-2 border-background">
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                
                <TabsContent value="members" className="space-y-4">
                  {selectedSpace.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${getOnlineStatusColor(member.status)}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {member.status}
                      </Badge>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="activity">
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Activity feed coming soon...</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a team space to view details</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
