
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";

interface NewRole {
  title: string;
  years_experience: string;
}

interface AddRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddRole: (role: NewRole) => Promise<void>;
  isSubmitting: boolean;
}

export function AddRoleDialog({ open, onOpenChange, onAddRole, isSubmitting }: AddRoleDialogProps) {
  const [newRole, setNewRole] = useState<NewRole>({
    title: "",
    years_experience: ""
  });

  const handleSubmit = async () => {
    await onAddRole(newRole);
    setNewRole({ title: "", years_experience: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Role</DialogTitle>
          <DialogDescription>
            Add a new role to the career track
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role-title">Role Title</Label>
            <Input 
              id="role-title"
              value={newRole.title}
              onChange={(e) => setNewRole({...newRole, title: e.target.value})}
              placeholder="e.g. Product Manager"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="years">Experience Range (years)</Label>
            <Input 
              id="years"
              value={newRole.years_experience}
              onChange={(e) => setNewRole({...newRole, years_experience: e.target.value})}
              placeholder="e.g. 3-5"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Add Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
