
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { User, ReviewCycle, PerformanceReview } from "@/types";
import { users as mockUsers } from "@/data/mockData";
import { v4 as uuidv4 } from 'uuid';

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
  
  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setEmployeeId("");
      setCycleId(cycles.length > 0 ? cycles[0].id : "");
      setInitialComments("");
    }
  }, [open, cycles]);
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employeeId || !cycleId) return;
    
    const selectedCycle = cycles.find(c => c.id === cycleId);
    if (!selectedCycle) return;
    
    // Create a new review
    const newReview: PerformanceReview = {
      id: uuidv4(),
      employeeId: employeeId,
      reviewerId: currentUser?.id || "",
      cycleId: cycleId,
      status: "not_started",
      ratings: selectedCycle.parameters.map(paramId => ({
        parameterId: paramId,
        score: 0,
        comment: ""
      })),
      overallRating: 0,
      feedback: initialComments,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    onCreateReview(newReview);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
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
                  {cycles.map(cycle => (
                    <SelectItem key={cycle.id} value={cycle.id}>
                      {cycle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
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
            <Button type="submit" disabled={!employeeId || !cycleId}>
              Create Review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
