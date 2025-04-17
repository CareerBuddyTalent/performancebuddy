
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, ReviewCycle, PerformanceReview, ReviewParameter } from "@/types";
import { users as mockUsers } from "@/data/mockData";
import { v4 as uuidv4 } from 'uuid';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface CreateReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateReview: (review: PerformanceReview) => void;
  cycles: ReviewCycle[];
  currentUser: User | null;
}

export default function CreateReviewDialog({
  open,
  onOpenChange,
  onCreateReview,
  cycles,
  currentUser
}: CreateReviewDialogProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [cycleId, setCycleId] = useState("");
  const [initialComments, setInitialComments] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<ReviewCycle | null>(null);
  
  // Filter available cycles to only performance review cycles
  const performanceCycles = cycles.filter(cycle => 
    cycle.purpose === "performance" || !cycle.purpose // Support legacy cycles without purpose
  );
  
  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setEmployeeId("");
      setCycleId(performanceCycles.length > 0 ? performanceCycles[0].id : "");
      setInitialComments("");
      setSelectedCycle(performanceCycles.length > 0 ? performanceCycles[0] : null);
    }
  }, [open, performanceCycles]);
  
  // Filter users based on current user role
  useEffect(() => {
    if (currentUser) {
      // Admin can see all users
      if (currentUser.role === "admin") {
        setFilteredUsers(mockUsers.filter(u => u.role !== "admin"));
      } 
      // Manager can only see their direct reports
      else if (currentUser.role === "manager") {
        setFilteredUsers(
          mockUsers.filter(u => u.manager === currentUser.name)
        );
      } else {
        setFilteredUsers([]);
      }
    }
  }, [currentUser]);
  
  // Update selected cycle when cycleId changes
  useEffect(() => {
    const cycle = cycles.find(c => c.id === cycleId);
    setSelectedCycle(cycle || null);
  }, [cycleId, cycles]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employeeId || !cycleId || !selectedCycle) return;
    
    // Create ratings array from the cycle parameters
    const ratings = selectedCycle.parameters.map(param => ({
      parameterId: typeof param === 'string' ? param : param.id,
      score: 0,
      comment: ""
    }));
    
    // Create a new review
    const newReview: PerformanceReview = {
      id: uuidv4(),
      employeeId: employeeId,
      reviewerId: currentUser?.id || "",
      cycleId: cycleId,
      status: "not_started",
      ratings: ratings,
      overallRating: 0,
      feedback: initialComments,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    onCreateReview(newReview);
  };

  const getCategoryBadge = (category: string) => {
    switch(category) {
      case 'performance':
        return <Badge variant="outline" className="bg-blue-100 text-blue-700">Performance</Badge>;
      case 'soft':
        return <Badge variant="outline" className="bg-green-100 text-green-700">Soft Skills</Badge>;
      case 'technical':
        return <Badge variant="outline" className="bg-purple-100 text-purple-700">Technical</Badge>;
      case 'goals':
        return <Badge variant="outline" className="bg-amber-100 text-amber-700">Goal-related</Badge>;
      default:
        return <Badge variant="outline" className="bg-slate-100 text-slate-700">{category}</Badge>;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Performance Review</DialogTitle>
            <DialogDescription>
              Start a new performance review for an employee
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employee">Employee</Label>
              <Select
                value={employeeId}
                onValueChange={setEmployeeId}
              >
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {filteredUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} - {user.position || user.department || "No position"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cycle">Review Cycle</Label>
              <Select
                value={cycleId}
                onValueChange={setCycleId}
              >
                <SelectTrigger id="cycle">
                  <SelectValue placeholder="Select a review cycle" />
                </SelectTrigger>
                <SelectContent>
                  {performanceCycles.map(cycle => (
                    <SelectItem key={cycle.id} value={cycle.id}>
                      {cycle.name} {cycle.type && `(${cycle.type})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {performanceCycles.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No active performance review cycles available. 
                  <br />Create one in the Cycles section.
                </p>
              )}
            </div>
            
            {selectedCycle && selectedCycle.parameters && selectedCycle.parameters.length > 0 && (
              <div className="grid gap-2">
                <Label>Review Parameters</Label>
                <Accordion type="single" collapsible className="border rounded-md">
                  <AccordionItem value="parameters">
                    <AccordionTrigger className="px-4">
                      View {selectedCycle.parameters.length} Parameters
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-2">
                        {selectedCycle.parameters.map((param, index) => {
                          // Handle both string ids (legacy) and parameter objects
                          const paramId = typeof param === 'string' ? param : param.id;
                          const paramName = typeof param === 'string' ? `Parameter ${index + 1}` : param.name;
                          const paramDesc = typeof param === 'string' ? '' : param.description;
                          const paramCategory = typeof param === 'string' ? 'performance' : param.category;
                          
                          return (
                            <div key={paramId} className="p-2 border rounded-md text-sm">
                              <div className="flex justify-between items-start">
                                <span className="font-medium">{paramName}</span>
                                {getCategoryBadge(paramCategory)}
                              </div>
                              {paramDesc && (
                                <p className="text-xs text-muted-foreground mt-1">{paramDesc}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="comments">Initial Comments (Optional)</Label>
              <Textarea
                id="comments"
                placeholder="Add any initial comments or instructions for the review"
                value={initialComments}
                onChange={(e) => setInitialComments(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!employeeId || !cycleId || !selectedCycle}
            >
              Create Review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
