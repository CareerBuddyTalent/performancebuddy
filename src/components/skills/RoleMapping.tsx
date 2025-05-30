
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"; 
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal, Users, X } from "lucide-react";
import { toast } from "sonner";
import { Skill } from "@/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Role, RoleMappingProps } from "./role-mapping/types";
import { RoleSkillList } from "./role-mapping/RoleSkillList";
import { AddSkillDialog } from "./role-mapping/AddSkillDialog";

export function RoleMapping({ roles: initialRoles, skills, filteredSkills }: RoleMappingProps) {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<Partial<Role>>({
    title: "",
    department: "",
    skills: []
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAddRole = () => {
    if (!newRole.title || !newRole.department) {
      toast.error("Please fill in all required fields");
      return;
    }

    const roleId = crypto.randomUUID();
    const role: Role = {
      id: roleId,
      title: newRole.title,
      department: newRole.department,
      skills: newRole.skills || []
    };

    setRoles([...roles, role]);
    setNewRole({ title: "", department: "", skills: [] });
    setIsAddRoleDialogOpen(false);
    setSelectedRole(roleId);
    toast.success("Role added successfully");
  };

  const handleAddSkillToRole = (skillName: string, proficiency: number) => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      if (!selectedRole) {
        toast.error("No role selected");
        setIsSubmitting(false);
        return;
      }

      // This is a simplified mock implementation - in a real app, you'd call an API
      // to create the skill and get back the new skill ID
      const newSkillId = crypto.randomUUID();
      
      setRoles(roles.map(role => {
        if (role.id === selectedRole) {
          return {
            ...role,
            skills: [...role.skills, newSkillId]
          };
        }
        return role;
      }));

      setIsAddSkillDialogOpen(false);
      setIsSubmitting(false);
      toast.success(`Skill "${skillName}" added to role`);
    }, 500);
  };

  const handleRemoveSkillFromRole = (skillId: string) => {
    setRoles(roles.map(role => {
      if (role.id === selectedRole) {
        return {
          ...role,
          skills: role.skills.filter(id => id !== skillId)
        };
      }
      return role;
    }));
    toast.success("Skill removed from role");
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter(role => role.id !== roleId));
    if (selectedRole === roleId) {
      setSelectedRole("");
    }
    toast.success("Role deleted successfully");
  };

  // Get displayed skills based on selected role
  const roleSkills = selectedRole 
    ? roles.find(r => r.id === selectedRole)?.skills.map(skillId => 
        skills.find(s => s.id === skillId)
      ).filter(Boolean) as Skill[]
    : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Role-Specific Skills Mapping</CardTitle>
            <CardDescription>Define and view skills required for each role or position</CardDescription>
          </div>
          <Button onClick={() => setIsAddRoleDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Role
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <h3 className="text-lg font-medium mb-4">Roles & Positions</h3>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">All Roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.id}>{role.title} ({role.department})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="mt-6 space-y-4">
              {roles.map(role => (
                <div 
                  key={role.id} 
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-accent ${selectedRole === role.id ? 'border-primary bg-accent' : 'border-border'}`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{role.title}</div>
                      <div className="text-sm text-muted-foreground">{role.department}</div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDeleteRole(role.id)}>
                          Delete Role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {role.skills.map(skillId => {
                      const skill = skills.find(s => s.id === skillId);
                      return skill ? (
                        <Badge key={skillId} variant="secondary" className="text-xs">
                          {skill.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full md:w-2/3">
            {selectedRole ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">
                    {roles.find(r => r.id === selectedRole)?.title} Required Skills
                  </h3>
                  <Button onClick={() => setIsAddSkillDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Skills
                  </Button>
                </div>
                
                <RoleSkillList
                  roleSkills={roleSkills}
                  onRemoveSkill={handleRemoveSkillFromRole}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] border border-dashed rounded-lg">
                <div className="text-center text-muted-foreground">
                  <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <h3 className="text-lg font-medium">Select a Role</h3>
                  <p className="max-w-xs mx-auto mt-2">
                    Choose a role from the list to view the required skills and competencies
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Dialog for adding a new role */}
      <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>
              Create a new role or position with required skills
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Role Title</Label>
              <Input 
                id="title"
                value={newRole.title}
                onChange={(e) => setNewRole({...newRole, title: e.target.value})}
                placeholder="e.g. Senior Frontend Developer"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department"
                value={newRole.department}
                onChange={(e) => setNewRole({...newRole, department: e.target.value})}
                placeholder="e.g. Engineering"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddRoleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddRole}>Add Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for adding skills to a role */}
      <AddSkillDialog 
        open={isAddSkillDialogOpen}
        onOpenChange={setIsAddSkillDialogOpen}
        onAddSkill={handleAddSkillToRole}
        isSubmitting={isSubmitting}
      />
    </Card>
  );
}
