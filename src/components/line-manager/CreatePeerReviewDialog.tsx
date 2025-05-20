
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { PeerReviewRequest } from "@/types/templates";

interface CreatePeerReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (review: PeerReviewRequest) => void;
}

export default function CreatePeerReviewDialog({
  open,
  onOpenChange,
  onSubmit
}: CreatePeerReviewDialogProps) {
  const [reviewee, setReviewee] = useState<string>("");
  const [reviewers, setReviewers] = useState<string[]>([]);
  const [templateId, setTemplateId] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [dueDate, setDueDate] = useState<Date>(addDays(new Date(), 7));
  const [instructions, setInstructions] = useState<string>("");

  // Mock team members
  const teamMembers = [
    { id: "emp1", name: "John Doe", avatar: "https://ui-avatars.com/api/?name=John+Doe" },
    { id: "emp2", name: "Emily Chen", avatar: "https://ui-avatars.com/api/?name=Emily+Chen" },
    { id: "emp3", name: "Michael Brown", avatar: "https://ui-avatars.com/api/?name=Michael+Brown" },
    { id: "emp4", name: "Sarah Kim", avatar: "https://ui-avatars.com/api/?name=Sarah+Kim" },
  ];

  // Mock templates
  const templates = [
    { id: "temp1", name: "360° Peer Review" },
    { id: "temp2", name: "Project Collaboration Review" },
    { id: "temp3", name: "Promotion Readiness Assessment" },
  ];

  const toggleReviewer = (id: string) => {
    setReviewers(prev => 
      prev.includes(id) 
        ? prev.filter(r => r !== id) 
        : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewee || reviewers.length === 0 || !templateId || !dueDate) {
      return;
    }
    
    // Create peer review requests for each reviewer
    const requests: PeerReviewRequest[] = reviewers.map(reviewerId => ({
      id: Math.random().toString(36).substring(2, 9),
      initiatorId: "manager1", // Current user ID
      revieweeId: reviewee,
      reviewerId,
      templateId,
      status: "pending",
      isAnonymous,
      dueDate,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Submit peer review requests (in a real app this would be a batch operation)
    requests.forEach(request => {
      onSubmit(request);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Peer Review</DialogTitle>
          <DialogDescription>
            Select a team member to review and assign peer reviewers.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Team Member to Review</Label>
            <div className="grid grid-cols-4 gap-2">
              {teamMembers.map(member => (
                <div 
                  key={member.id}
                  className={`border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-all ${
                    reviewee === member.id ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground'
                  }`}
                  onClick={() => {
                    setReviewee(member.id);
                    // Remove self from reviewers if selected
                    if (reviewers.includes(member.id)) {
                      setReviewers(prev => prev.filter(id => id !== member.id));
                    }
                  }}
                >
                  <Avatar className="h-10 w-10 mb-2">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-center line-clamp-1">{member.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Select Peer Reviewers</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {teamMembers
                .filter(member => member.id !== reviewee)
                .map(member => (
                  <div 
                    key={member.id}
                    className={`border rounded-lg p-3 flex items-center gap-2 cursor-pointer transition-all ${
                      reviewers.includes(member.id) ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground'
                    }`}
                    onClick={() => toggleReviewer(member.id)}
                  >
                    <Checkbox 
                      checked={reviewers.includes(member.id)}
                      onCheckedChange={() => toggleReviewer(member.id)}
                    />
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member.name}</span>
                    </div>
                  </div>
              ))}
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="template">Review Template</Label>
              <Select value={templateId} onValueChange={setTemplateId} required>
                <SelectTrigger id="template">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal w-full",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => date && setDueDate(date)}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="anonymous" 
                checked={isAnonymous} 
                onCheckedChange={(checked) => setIsAnonymous(!!checked)} 
              />
              <Label htmlFor="anonymous">Make reviews anonymous</Label>
            </div>
            <p className="text-sm text-muted-foreground pl-6">
              When enabled, the reviewee will not see who provided which feedback
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instructions">Additional Instructions (optional)</Label>
            <Textarea
              id="instructions"
              placeholder="Add specific instructions or context for reviewers..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!reviewee || reviewers.length === 0 || !templateId || !dueDate}
            >
              Send Review Requests
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
