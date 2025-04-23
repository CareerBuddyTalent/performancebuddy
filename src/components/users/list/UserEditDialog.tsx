
import { User } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

interface UserEditDialogProps {
  user: User | null;
  departments: string[];
  onClose: () => void;
  onSave: (user: User) => void;
  open: boolean;
}

export function UserEditDialog({ user, departments, onClose, onSave, open }: UserEditDialogProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    if (user) {
      setEditingUser({ ...user });
    }
  }, [user]);

  if (!editingUser) return null;

  const handleSave = () => {
    onSave(editingUser);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input 
                id="edit-name" 
                value={editingUser.name} 
                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input 
                id="edit-email" 
                type="email" 
                value={editingUser.email} 
                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select 
                value={editingUser.role} 
                onValueChange={(value) => setEditingUser({...editingUser, role: value as User['role']})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Roles</SelectLabel>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-department">Department</Label>
              <Select 
                value={editingUser.department || ""} 
                onValueChange={(value) => setEditingUser({...editingUser, department: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Departments</SelectLabel>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-position">Position</Label>
              <Input 
                id="edit-position" 
                value={editingUser.position || ""} 
                onChange={(e) => setEditingUser({...editingUser, position: e.target.value})} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-manager">Manager</Label>
              <Input 
                id="edit-manager" 
                value={editingUser.manager || ""} 
                onChange={(e) => setEditingUser({...editingUser, manager: e.target.value})} 
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
