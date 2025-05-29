
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, Heart, Star, Trophy, Plus, Users } from "lucide-react";
import { useState } from "react";

interface Recognition {
  id: string;
  type: 'appreciation' | 'achievement' | 'milestone' | 'innovation';
  title: string;
  description: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  recipient: {
    id: string;
    name: string;
    avatar?: string;
  };
  points: number;
  createdAt: Date;
  likes: number;
  isLiked?: boolean;
}

const mockRecognitions: Recognition[] = [
  {
    id: '1',
    type: 'achievement',
    title: 'Outstanding Project Delivery',
    description: 'Sarah led the team to deliver the Q4 project 2 weeks ahead of schedule with exceptional quality.',
    sender: { id: '1', name: 'Mike Johnson' },
    recipient: { id: '2', name: 'Sarah Chen' },
    points: 100,
    createdAt: new Date('2024-01-15'),
    likes: 12,
    isLiked: false
  },
  {
    id: '2',
    type: 'appreciation',
    title: 'Great Teamwork',
    description: 'Emma consistently goes above and beyond to help team members and maintain a positive atmosphere.',
    sender: { id: '3', name: 'Lisa Wang' },
    recipient: { id: '4', name: 'Emma Davis' },
    points: 50,
    createdAt: new Date('2024-01-14'),
    likes: 8,
    isLiked: true
  },
  {
    id: '3',
    type: 'innovation',
    title: 'Creative Problem Solving',
    description: 'James found an innovative solution that saved the company $50k in development costs.',
    sender: { id: '2', name: 'Sarah Chen' },
    recipient: { id: '5', name: 'James Wilson' },
    points: 150,
    createdAt: new Date('2024-01-13'),
    likes: 15,
    isLiked: false
  }
];

const recognitionTypes = [
  { value: 'appreciation', label: 'Appreciation', icon: Heart, color: 'text-pink-500', points: 50 },
  { value: 'achievement', label: 'Achievement', icon: Trophy, color: 'text-yellow-500', points: 100 },
  { value: 'milestone', label: 'Milestone', icon: Award, color: 'text-blue-500', points: 75 },
  { value: 'innovation', label: 'Innovation', icon: Star, color: 'text-purple-500', points: 150 }
];

export function RecognitionSystem() {
  const [recognitions, setRecognitions] = useState(mockRecognitions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [recipient, setRecipient] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const getTypeConfig = (type: string) => {
    return recognitionTypes.find(t => t.value === type) || recognitionTypes[0];
  };

  const handleLike = (recognitionId: string) => {
    setRecognitions(prev => 
      prev.map(recognition => 
        recognition.id === recognitionId 
          ? { 
              ...recognition, 
              isLiked: !recognition.isLiked,
              likes: recognition.isLiked ? recognition.likes - 1 : recognition.likes + 1
            }
          : recognition
      )
    );
  };

  const handleSendRecognition = () => {
    if (!selectedType || !recipient || !title || !description) return;

    const typeConfig = getTypeConfig(selectedType);
    const newRecognition: Recognition = {
      id: Math.random().toString(36).substr(2, 9),
      type: selectedType as any,
      title,
      description,
      sender: { id: 'current-user', name: 'Current User' },
      recipient: { id: recipient, name: recipient },
      points: typeConfig.points,
      createdAt: new Date(),
      likes: 0,
      isLiked: false
    };

    setRecognitions([newRecognition, ...recognitions]);
    setIsDialogOpen(false);
    setSelectedType('');
    setRecipient('');
    setTitle('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Recognition & Rewards</h2>
          <p className="text-muted-foreground">Celebrate achievements and show appreciation</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Give Recognition
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Give Recognition</DialogTitle>
              <DialogDescription>
                Recognize a team member's great work or contribution
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Recognition Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {recognitionTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${type.color}`} />
                            <span>{type.label}</span>
                            <Badge variant="secondary" className="ml-auto">
                              {type.points} pts
                            </Badge>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Recipient</Label>
                <Input
                  placeholder="Enter recipient name..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="Recognition title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe what made this recognition-worthy..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSendRecognition} className="flex-1">
                  Send Recognition
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Recognition Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {recognitionTypes.map((type) => {
          const Icon = type.icon;
          const count = recognitions.filter(r => r.type === type.value).length;
          return (
            <Card key={type.value}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Icon className={`h-8 w-8 ${type.color}`} />
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-muted-foreground">{type.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recognition Feed */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Recognition</h3>
        {recognitions.map((recognition) => {
          const typeConfig = getTypeConfig(recognition.type);
          const Icon = typeConfig.icon;
          
          return (
            <Card key={recognition.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Icon className={`h-6 w-6 ${typeConfig.color} mt-1`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{recognition.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {recognition.sender.name} → {recognition.recipient.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          +{recognition.points} pts
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {recognition.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm mb-3">{recognition.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(recognition.id)}
                          className={recognition.isLiked ? 'text-red-500' : ''}
                        >
                          <Heart className={`h-4 w-4 mr-1 ${recognition.isLiked ? 'fill-current' : ''}`} />
                          {recognition.likes}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Users className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {recognition.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
