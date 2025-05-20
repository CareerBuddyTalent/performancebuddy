
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Feedback } from "@/types/templates";

interface ProvideFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (feedback: Feedback) => void;
}

export default function ProvideFeedbackDialog({
  open,
  onOpenChange,
  onSubmit
}: ProvideFeedbackDialogProps) {
  const [recipient, setRecipient] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [feedbackType, setFeedbackType] = useState<"praise" | "suggestion" | "criticism">("praise");
  const [visibility, setVisibility] = useState<"private" | "manager" | "team" | "public">("private");
  const [goalId, setGoalId] = useState<string>("");
  const [skillId, setSkillId] = useState<string>("");
  
  // Mock employees (team members)
  const employees = [
    { id: "emp1", name: "John Doe", avatar: "https://ui-avatars.com/api/?name=John+Doe" },
    { id: "emp2", name: "Emily Chen", avatar: "https://ui-avatars.com/api/?name=Emily+Chen" },
    { id: "emp3", name: "Michael Brown", avatar: "https://ui-avatars.com/api/?name=Michael+Brown" },
  ];
  
  // Mock goals
  const goals = [
    { id: "goal1", title: "Complete Q2 sales targets" },
    { id: "goal2", title: "Improve customer satisfaction score" },
    { id: "goal3", title: "Launch new product feature" },
  ];
  
  // Mock skills
  const skills = [
    { id: "skill1", name: "Communication" },
    { id: "skill2", name: "Technical Skills" },
    { id: "skill3", name: "Leadership" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipient || !content || !feedbackType) {
      return;
    }
    
    const feedback: Feedback = {
      id: Math.random().toString(36).substring(2, 9),
      providerId: "manager1", // Current user ID
      recipientId: recipient,
      content,
      type: feedbackType,
      visibility,
      relatedGoalId: goalId || undefined,
      relatedSkillId: skillId || undefined,
      status: "published",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    onSubmit(feedback);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Provide Feedback</DialogTitle>
          <DialogDescription>
            Give feedback to your team members. Be specific, constructive, and actionable.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Team Member</Label>
            <div className="grid grid-cols-3 gap-2">
              {employees.map(emp => (
                <div 
                  key={emp.id}
                  className={`border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-all ${
                    recipient === emp.id ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground'
                  }`}
                  onClick={() => setRecipient(emp.id)}
                >
                  <Avatar className="h-12 w-12 mb-2">
                    <AvatarImage src={emp.avatar} alt={emp.name} />
                    <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-center">{emp.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Feedback Type</Label>
            <RadioGroup 
              defaultValue="praise" 
              value={feedbackType}
              onValueChange={(value) => setFeedbackType(value as "praise" | "suggestion" | "criticism")}
              className="flex space-x-1"
            >
              <div className="flex items-center space-x-2 border rounded-l-lg p-3 flex-1">
                <RadioGroupItem value="praise" id="praise" />
                <Label htmlFor="praise" className="cursor-pointer">Praise</Label>
              </div>
              <div className="flex items-center space-x-2 border p-3 flex-1">
                <RadioGroupItem value="suggestion" id="suggestion" />
                <Label htmlFor="suggestion" className="cursor-pointer">Suggestion</Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-r-lg p-3 flex-1">
                <RadioGroupItem value="criticism" id="criticism" />
                <Label htmlFor="criticism" className="cursor-pointer">Constructive Feedback</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Feedback Content</Label>
            <Textarea
              id="content"
              placeholder="Be specific about what the person did well or could improve..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goal">Related Goal (optional)</Label>
              <Select value={goalId} onValueChange={setGoalId}>
                <SelectTrigger id="goal">
                  <SelectValue placeholder="Select a goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {goals.map(goal => (
                    <SelectItem key={goal.id} value={goal.id}>{goal.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="skill">Related Skill (optional)</Label>
              <Select value={skillId} onValueChange={setSkillId}>
                <SelectTrigger id="skill">
                  <SelectValue placeholder="Select a skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {skills.map(skill => (
                    <SelectItem key={skill.id} value={skill.id}>{skill.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <Select value={visibility} onValueChange={(value) => setVisibility(value as any)}>
              <SelectTrigger id="visibility">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private (Employee & Manager only)</SelectItem>
                <SelectItem value="manager">Management Team</SelectItem>
                <SelectItem value="team">Full Team</SelectItem>
                <SelectItem value="public">Company-wide Recognition</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!recipient || !content || !feedbackType}
            >
              Send Feedback
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
