
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useClerkAuth } from "@/context/ClerkAuthContext";
import { Goal } from "@/types";
import { toast } from "sonner";

interface GoalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (goal: Goal) => void;
  goal?: Goal;
}

export default function GoalFormDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  goal 
}: GoalFormDialogProps) {
  const { user } = useClerkAuth();
  const [title, setTitle] = useState(goal?.title || "");
  const [description, setDescription] = useState(goal?.description || "");
  const [dueDate, setDueDate] = useState(
    goal?.dueDate ? goal.dueDate.toISOString().split('T')[0] : ""
  );

  const handleSave = () => {
    if (!user || !title.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newGoal: Goal = {
      id: goal?.id || crypto.randomUUID(),
      userId: user.id,
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      status: goal?.status || "not_started",
      progress: goal?.progress || 0,
      createdAt: goal?.createdAt || new Date(),
      updatedAt: new Date(),
      level: goal?.level || "individual",
    };

    onSave(newGoal);
    onOpenChange(false);
    
    // Reset form
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{goal ? "Edit Goal" : "Create New Goal"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter goal title"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter goal description"
              rows={3}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Due Date</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {goal ? "Update" : "Create"} Goal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
