
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Plus, Loader2, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CareerRole {
  id: string;
  title: string;
  path_id: string;
}

interface CareerPath {
  id: string;
  title: string;
}

interface RoleSkill {
  id: string;
  role_id: string;
  skill_name: string;
  proficiency_level: number;
}

export function RoleSkillsMapping() {
  const [isLoading, setIsLoading] = useState(true);
  const [paths, setPaths] = useState<CareerPath[]>([]);
  const [roles, setRoles] = useState<CareerRole[]>([]);
  const [skills, setSkills] = useState<RoleSkill[]>([]);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: "", proficiency: 3 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredRoles, setFilteredRoles] = useState<CareerRole[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch career paths
        const { data: pathsData, error: pathsError } = await supabase
          .from('career_paths')
          .select('id, title')
          .order('title');

        if (pathsError) throw pathsError;

        setPaths(pathsData || []);

        if (pathsData && pathsData.length > 0) {
          setSelectedPathId(pathsData[0].id);
        }

        // Fetch all roles
        const { data: rolesData, error: rolesError } = await supabase
          .from('career_roles')
          .select('id, title, path_id')
          .order('title');

        if (rolesError) throw rolesError;

        setRoles(rolesData || []);

        // Fetch all skills
        const { data: skillsData, error: skillsError } = await supabase
          .from('role_skills')
          .select('*');

        if (skillsError) throw skillsError;

        setSkills(skillsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedPathId) {
      const rolesByPath = roles.filter(role => role.path_id === selectedPathId);
      setFilteredRoles(rolesByPath);
      
      if (rolesByPath.length > 0 && (!selectedRoleId || !rolesByPath.some(r => r.id === selectedRoleId))) {
        setSelectedRoleId(rolesByPath[0].id);
      } else if (rolesByPath.length === 0) {
        setSelectedRoleId(null);
      }
    }
  }, [selectedPathId, roles, selectedRoleId]);

  const handleAddSkill = async () => {
    if (!selectedRoleId || !newSkill.name) {
      toast.error("Please select a role and enter a skill name");
      return;
    }

    setIsSubmitting(true);
    try {
      // Insert new skill
      const { data, error } = await supabase
        .from('role_skills')
        .insert({
          role_id: selectedRoleId,
          skill_name: newSkill.name,
          proficiency_level: newSkill.proficiency
        })
        .select();

      if (error) throw error;

      // Add the new skill to state
      setSkills([...skills, data[0]]);
      setNewSkill({ name: "", proficiency: 3 });
      setIsAddSkillDialogOpen(false);
      toast.success("Skill added successfully");
    } catch (error) {
      console.error('Error adding skill:', error);
      toast.error('Failed to add skill');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    try {
      const { error } = await supabase
        .from('role_skills')
        .delete()
        .eq('id', skillId);

      if (error) throw error;

      // Remove the skill from state
      setSkills(skills.filter(skill => skill.id !== skillId));
      toast.success("Skill removed successfully");
    } catch (error) {
      console.error('Error removing skill:', error);
      toast.error('Failed to remove skill');
    }
  };

  const getRoleSkills = (roleId: string) => {
    return skills.filter(skill => skill.role_id === roleId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Role-Specific Skills Mapping</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <CardTitle>Role-Specific Skills Mapping</CardTitle>
          <CardDescription>Define required skills and competencies for each role</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {paths.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No career paths found. Create career paths first.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Select Career Path</Label>
              <Select 
                value={selectedPathId || ''} 
                onValueChange={(value) => setSelectedPathId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a career path" />
                </SelectTrigger>
                <SelectContent>
                  {paths.map(path => (
                    <SelectItem key={path.id} value={path.id}>{path.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPathId && filteredRoles.length > 0 ? (
              <Tabs value={selectedRoleId || ''} onValueChange={setSelectedRoleId}>
                <TabsList className="flex flex-wrap max-w-full">
                  {filteredRoles.map(role => (
                    <TabsTrigger key={role.id} value={role.id}>
                      {role.title}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {filteredRoles.map(role => (
                  <TabsContent key={role.id} value={role.id} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Skills for {role.title}</h3>
                      <Button onClick={() => setIsAddSkillDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Skill
                      </Button>
                    </div>

                    <div className="border rounded-lg divide-y">
                      {getRoleSkills(role.id).length > 0 ? (
                        getRoleSkills(role.id).map(skill => (
                          <div key={skill.id} className="p-4 flex justify-between items-center">
                            <div>
                              <div className="font-medium">{skill.skill_name}</div>
                              <div className="flex items-center mt-1">
                                <div className="text-sm text-muted-foreground mr-2">Proficiency:</div>
                                <div className="flex space-x-1">
                                  {[1, 2, 3, 4, 5].map(level => (
                                    <div 
                                      key={level} 
                                      className={`w-4 h-4 rounded-full ${level <= skill.proficiency_level ? 'bg-primary' : 'bg-muted'}`}
                                    ></div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveSkill(skill.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-muted-foreground">
                          <ListChecks className="mx-auto h-12 w-12 mb-4 opacity-50" />
                          <p>No skills defined for this role yet</p>
                          <p className="text-sm mt-1">
                            Add skills to define competency requirements for this role
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            ) : selectedPathId ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No roles defined for this career path yet.</p>
              </div>
            ) : null}
          </div>
        )}
        
        {/* Dialog for adding a new skill */}
        <Dialog open={isAddSkillDialogOpen} onOpenChange={setIsAddSkillDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
              <DialogDescription>
                Define a required skill for this role
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skill-name">Skill Name</Label>
                <Input 
                  id="skill-name"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                  placeholder="e.g. Project Management"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="proficiency">Required Proficiency Level (1-5)</Label>
                <div className="flex items-center space-x-4">
                  <Slider 
                    id="proficiency"
                    min={1} 
                    max={5} 
                    step={1} 
                    value={[newSkill.proficiency]}
                    onValueChange={(value) => setNewSkill({...newSkill, proficiency: value[0]})}
                    className="flex-1"
                  />
                  <Badge>{newSkill.proficiency}</Badge>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Beginner</span>
                  <span>Expert</span>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddSkillDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddSkill} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Add Skill
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
