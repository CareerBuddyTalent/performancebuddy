
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ReviewCycle, PerformanceReview } from "@/types";
import { users as mockUsers } from "@/data/mockData";
import { v4 as uuidv4 } from 'uuid';
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

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
  const [activeTab, setActiveTab] = useState<"individual" | "team">("individual");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [cycleId, setCycleId] = useState("");
  const [initialComments, setInitialComments] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<ReviewCycle | null>(null);
  
  // Filter available cycles to only performance review cycles
  const performanceCycles = cycles.filter(cycle => 
    cycle.purpose === "performance" || !cycle.purpose
  );
  
  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setActiveTab("individual");
      setSelectedEmployees([]);
      setCycleId(performanceCycles.length > 0 ? performanceCycles[0].id : "");
      setInitialComments("");
      setSelectedCycle(performanceCycles.length > 0 ? performanceCycles[0] : null);
    }
  }, [open, performanceCycles]);
  
  // Filter users based on current user role
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "manager") {
        setFilteredUsers(
          mockUsers.filter(u => u.manager === currentUser.name && u.role === "employee")
        );
      } else if (currentUser.role === "admin") {
        setFilteredUsers(mockUsers.filter(u => u.role === "employee"));
      }
    }
  }, [currentUser]);
  
  // Update selected cycle when cycleId changes
  useEffect(() => {
    const cycle = cycles.find(c => c.id === cycleId);
    setSelectedCycle(cycle || null);
  }, [cycleId, cycles]);
  
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    
    if (!cycleId || !selectedCycle) {
      toast.error("Please select a review cycle");
      return;
    }

    if (activeTab === "individual" && selectedEmployees.length !== 1) {
      toast.error("Please select an employee for individual review");
      return;
    }

    if (activeTab === "team" && selectedEmployees.length === 0) {
      toast.error("Please select at least one team member");
      return;
    }
    
    // Create reviews for all selected employees
    selectedEmployees.forEach(employeeId => {
      const ratings = selectedCycle.parameters.map(param => ({
        parameterId: typeof param === 'string' ? param : param.id,
        score: 0,
        comment: ""
      }));
      
      const newReview: PerformanceReview = {
        id: uuidv4(),
        employeeId,
        reviewerId: currentUser?.id || "",
        cycleId,
        status: "not_started",
        ratings,
        overallRating: 0,
        feedback: initialComments,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      onCreateReview(newReview);
    });

    const message = activeTab === "individual" 
      ? "Review created successfully" 
      : `${selectedEmployees.length} team reviews created successfully`;
    
    toast.success(message);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Performance Review</DialogTitle>
            <DialogDescription>
              Create a new performance review for your team members
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "individual" | "team")} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="individual">Individual Review</TabsTrigger>
              <TabsTrigger value="team">Team Review</TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>Review Cycle</Label>
                  <Select
                    value={cycleId}
                    onValueChange={setCycleId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a review cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      {performanceCycles.map(cycle => (
                        <SelectItem key={cycle.id} value={cycle.id}>
                          {cycle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>{activeTab === "individual" ? "Employee" : "Select Team Members"}</Label>
                  {activeTab === "individual" ? (
                    <Select
                      value={selectedEmployees[0] || ""}
                      onValueChange={(value) => setSelectedEmployees([value])}
                    >
                      <SelectTrigger>
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
                  ) : (
                    <div className="border rounded-md p-4 space-y-2 max-h-[200px] overflow-y-auto">
                      {filteredUsers.map(user => (
                        <div key={user.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={user.id}
                            checked={selectedEmployees.includes(user.id)}
                            onCheckedChange={(checked) => {
                              setSelectedEmployees(prev => 
                                checked 
                                  ? [...prev, user.id]
                                  : prev.filter(id => id !== user.id)
                              );
                            }}
                          />
                          <label
                            htmlFor={user.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {user.name} - {user.position || user.department || "No position"}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <Label>Initial Comments (Optional)</Label>
                  <Textarea
                    placeholder="Add any initial comments or instructions for the review"
                    value={initialComments}
                    onChange={(e) => setInitialComments(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </Tabs>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={
                !cycleId || 
                !selectedCycle || 
                (activeTab === "individual" && selectedEmployees.length !== 1) ||
                (activeTab === "team" && selectedEmployees.length === 0)
              }
            >
              Create {activeTab === "individual" ? "Review" : "Team Reviews"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
