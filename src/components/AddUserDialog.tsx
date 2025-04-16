
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, UserRole } from "@/types";
import { PlusCircle } from "lucide-react";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddUser: (user: User) => void;
  departments: string[];
  onAddDepartment: (department: string) => void;
}

export default function AddUserDialog({
  open,
  onOpenChange,
  onAddUser,
  departments,
  onAddDepartment
}: AddUserDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("employee");
  const [department, setDepartment] = useState(departments[0] || "");
  const [position, setPosition] = useState("");
  const [manager, setManager] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [showNewDeptInput, setShowNewDeptInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new user object
    const newUser: User = {
      id: Date.now().toString(), // Generate a simple ID
      name,
      email,
      role: role as UserRole,
      department: department || undefined,
      position: position || undefined,
      profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s/g, '')}`,
      manager: manager || undefined,
    };
    
    onAddUser(newUser);
    resetForm();
  };

  const handleAddDepartment = () => {
    if (newDepartment.trim()) {
      onAddDepartment(newDepartment.trim());
      setDepartment(newDepartment.trim());
      setNewDepartment("");
      setShowNewDeptInput(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setRole("employee");
    setDepartment(departments[0] || "");
    setPosition("");
    setManager("");
    setNewDepartment("");
    setShowNewDeptInput(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Add a new team member to the performance platform
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="john@example.com"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Roles</SelectLabel>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              {!showNewDeptInput ? (
                <div className="flex space-x-2">
                  <Select 
                    value={department} 
                    onValueChange={setDepartment}
                  >
                    <SelectTrigger className="w-full">
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
                        <SelectItem value="new">Add New...</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Input 
                    value={newDepartment} 
                    onChange={(e) => setNewDepartment(e.target.value)} 
                    placeholder="Department name"
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="icon" 
                    onClick={handleAddDepartment}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input 
                id="position" 
                value={position} 
                onChange={(e) => setPosition(e.target.value)} 
                placeholder="Software Engineer"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manager">Manager</Label>
              <Input 
                id="manager" 
                value={manager} 
                onChange={(e) => setManager(e.target.value)} 
                placeholder="Manager name (optional)"
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add User</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
