
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, MoreHorizontal, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface CareerRole {
  id: string;
  title: string;
  years_experience: string;
}

interface CareerPath {
  id: string;
  title: string;
  color: string;
  roles: CareerRole[];
}

export function CareerPaths() {
  const { user } = useAuth();
  const [paths, setPaths] = useState<CareerPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [newPath, setNewPath] = useState<Partial<CareerPath>>({
    title: "",
    color: "bg-green-500"
  });
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState({ title: "", years_experience: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch career paths from Supabase
  useEffect(() => {
    const fetchCareerPaths = async () => {
      setIsLoading(true);
      try {
        // Fetch career paths
        const { data: pathsData, error: pathsError } = await supabase
          .from('career_paths')
          .select('*');

        if (pathsError) throw pathsError;

        // Fetch roles for each path
        const pathsWithRoles = await Promise.all(
          pathsData.map(async (path) => {
            const { data: rolesData, error: rolesError } = await supabase
              .from('career_roles')
              .select('*')
              .eq('path_id', path.id)
              .order('order_position', { ascending: true });

            if (rolesError) throw rolesError;

            return {
              ...path,
              roles: rolesData || []
            };
          })
        );

        setPaths(pathsWithRoles);
      } catch (error) {
        console.error('Error fetching career paths:', error);
        toast.error('Failed to load career paths');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCareerPaths();
  }, []);

  const handleAddPath = async () => {
    if (!newPath.title) {
      toast.error("Please enter a track title");
      return;
    }

    setIsSubmitting(true);
    try {
      // Insert new career path
      const { data, error } = await supabase
        .from('career_paths')
        .insert({
          title: newPath.title,
          color: newPath.color,
          created_by: user?.id
        })
        .select();

      if (error) throw error;

      // Add the new path to state
      setPaths([...paths, { ...data[0], roles: [] }]);
      setNewPath({ title: "", color: "bg-green-500" });
      setIsDialogOpen(false);
      toast.success("Career path added successfully");
    } catch (error) {
      console.error('Error adding career path:', error);
      toast.error('Failed to add career path');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddRole = async () => {
    if (!newRole.title || !newRole.years_experience) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!selectedPathId) return;

    setIsSubmitting(true);
    try {
      // Get the current highest order position
      const { data: existingRoles } = await supabase
        .from('career_roles')
        .select('order_position')
        .eq('path_id', selectedPathId)
        .order('order_position', { ascending: false })
        .limit(1);

      const nextPosition = existingRoles && existingRoles.length > 0 
        ? (existingRoles[0].order_position || 0) + 1 
        : 0;

      // Insert new role
      const { data, error } = await supabase
        .from('career_roles')
        .insert({
          path_id: selectedPathId,
          title: newRole.title,
          years_experience: newRole.years_experience,
          order_position: nextPosition
        })
        .select();

      if (error) throw error;

      // Update the state
      setPaths(paths.map(path => 
        path.id === selectedPathId 
          ? { ...path, roles: [...path.roles, data[0]] } 
          : path
      ));
      
      setNewRole({ title: "", years_experience: "" });
      setIsRoleDialogOpen(false);
      toast.success("Role added successfully");
    } catch (error) {
      console.error('Error adding role:', error);
      toast.error('Failed to add role');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemovePath = async (id: string) => {
    try {
      const { error } = await supabase
        .from('career_paths')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPaths(paths.filter(path => path.id !== id));
      toast.success("Career path removed");
    } catch (error) {
      console.error('Error removing career path:', error);
      toast.error('Failed to remove career path');
    }
  };

  const openAddRoleDialog = (pathId: string) => {
    setSelectedPathId(pathId);
    setIsRoleDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Career Development Paths</CardTitle>
          <CardDescription>Loading career paths...</CardDescription>
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
          <CardTitle>Career Development Paths</CardTitle>
          <CardDescription>View and manage career progression paths within the organization</CardDescription>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="mt-4 sm:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          Add Career Track
        </Button>
      </CardHeader>
      <CardContent>
        {paths.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No career paths found. Create your first career path.</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Career Track
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row flex-wrap gap-8 py-4">
            {paths.map((path) => (
              <div key={path.id} className="w-full md:w-1/3 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{path.title}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openAddRoleDialog(path.id)}>
                        Add Role
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRemovePath(path.id)}>
                        Remove Track
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="relative">
                  <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${path.color}`}></div>
                  
                  {path.roles.length > 0 ? (
                    path.roles.map((role, index) => (
                      <div key={role.id} className="relative pl-10 pb-8">
                        <div className={`absolute left-2.5 w-5 h-5 ${path.color} rounded-full`}></div>
                        <h4 className="font-medium">{role.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {role.years_experience} years
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="pl-10 pb-8 italic text-muted-foreground">
                      No roles added yet
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Dialog for adding a new career path */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Career Track</DialogTitle>
            <DialogDescription>
              Create a new career development path for employees
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Track Title</Label>
              <Input 
                id="title"
                value={newPath.title}
                onChange={(e) => setNewPath({...newPath, title: e.target.value})}
                placeholder="e.g. Product Track"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Track Color</Label>
              <div className="flex gap-2">
                {["bg-primary", "bg-secondary", "bg-green-500", "bg-blue-500", "bg-purple-500"].map((color) => (
                  <div 
                    key={color}
                    className={`w-8 h-8 rounded-full cursor-pointer ${color} ${newPath.color === color ? 'ring-2 ring-offset-2 ring-ring' : ''}`}
                    onClick={() => setNewPath({...newPath, color})}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddPath} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Add Track
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for adding a new role to a career path */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddRole} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Add Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
