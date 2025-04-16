
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface CareerPath {
  id: string;
  title: string;
  roles: { title: string; years: string }[];
  color: string;
}

export function CareerPaths() {
  const [paths, setPaths] = useState<CareerPath[]>([
    {
      id: "technical",
      title: "Technical Track",
      roles: [
        { title: "Junior Developer", years: "1-3" },
        { title: "Developer", years: "2-4" },
        { title: "Senior Developer", years: "3-5" },
        { title: "Principal Engineer", years: "4-6" },
        { title: "CTO", years: "5-7" }
      ],
      color: "bg-primary"
    },
    {
      id: "management",
      title: "Management Track",
      roles: [
        { title: "Team Lead", years: "2-4" },
        { title: "Engineering Manager", years: "3-5" },
        { title: "Director of Engineering", years: "4-6" },
        { title: "VP of Engineering", years: "5-7" },
        { title: "CTO", years: "6-8" }
      ],
      color: "bg-secondary"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [newPath, setNewPath] = useState<Partial<CareerPath>>({
    title: "",
    roles: [],
    color: "bg-green-500"
  });
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState({ title: "", years: "" });

  const handleAddPath = () => {
    if (!newPath.title) {
      toast.error("Please enter a track title");
      return;
    }

    const newPathComplete: CareerPath = {
      id: crypto.randomUUID(),
      title: newPath.title,
      roles: newPath.roles || [],
      color: newPath.color || "bg-green-500"
    };

    setPaths([...paths, newPathComplete]);
    setNewPath({ title: "", roles: [], color: "bg-green-500" });
    setIsDialogOpen(false);
    toast.success("Career path added successfully");
  };

  const handleAddRole = () => {
    if (!newRole.title || !newRole.years) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!selectedPathId) return;

    setPaths(
      paths.map(path => 
        path.id === selectedPathId 
          ? { ...path, roles: [...path.roles, newRole] } 
          : path
      )
    );
    
    setNewRole({ title: "", years: "" });
    setIsRoleDialogOpen(false);
    toast.success("Role added successfully");
  };

  const handleRemovePath = (id: string) => {
    setPaths(paths.filter(path => path.id !== id));
    toast.success("Career path removed");
  };

  const openAddRoleDialog = (pathId: string) => {
    setSelectedPathId(pathId);
    setIsRoleDialogOpen(true);
  };

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
                
                {path.roles.map((role, index) => (
                  <div key={index} className="relative pl-10 pb-8">
                    <div className={`absolute left-2.5 w-5 h-5 ${path.color} rounded-full`}></div>
                    <h4 className="font-medium">{role.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {role.years} years
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
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
            <Button onClick={handleAddPath}>Add Track</Button>
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
                value={newRole.years}
                onChange={(e) => setNewRole({...newRole, years: e.target.value})}
                placeholder="e.g. 3-5"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddRole}>Add Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
