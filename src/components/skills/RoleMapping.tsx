
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skill } from "@/types";
import { Users } from "lucide-react";

interface Role {
  id: string;
  title: string;
  department: string;
  skills: string[];
}

interface RoleMappingProps {
  roles: Role[];
  skills: Skill[];
  filteredSkills: Skill[];
}

export function RoleMapping({ roles, skills, filteredSkills }: RoleMappingProps) {
  const [selectedRole, setSelectedRole] = useState<string>("");
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Role-Specific Skills Mapping</CardTitle>
        <CardDescription>Define and view skills required for each role or position</CardDescription>
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
                  <div className="font-medium">{role.title}</div>
                  <div className="text-sm text-muted-foreground">{role.department}</div>
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
                <h3 className="text-lg font-medium mb-4">
                  {roles.find(r => r.id === selectedRole)?.title} Required Skills
                </h3>
                
                <div className="grid gap-4">
                  {filteredSkills.map(skill => (
                    <Card key={skill.id}>
                      <CardHeader className="py-4">
                        <CardTitle className="text-lg">{skill.name}</CardTitle>
                        <CardDescription>{skill.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Beginner</span>
                            <span>Expert</span>
                          </div>
                          <div className="w-full bg-secondary h-2 rounded-full">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${(skill.levels.length / 5) * 100}%` }}></div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Expected proficiency: Level {skill.levels.length} - {skill.levels[skill.levels.length - 1].description}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">Actions</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Add Skill to Role</DropdownMenuItem>
                      <DropdownMenuItem>Edit Required Proficiency</DropdownMenuItem>
                      <DropdownMenuItem>Remove Skill from Role</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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
    </Card>
  );
}
