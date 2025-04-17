
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PermissionRole {
  id: string;
  role: string;
  viewAll: boolean;
  editOwn: boolean;
  editAll: boolean;
  createNew: boolean;
  deleteOwn: boolean;
  deleteAll: boolean;
  exportData: boolean;
}

interface SetPermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SetPermissionsDialog({ open, onOpenChange }: SetPermissionsDialogProps) {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("roles");
  
  // Mock permission data
  const [permissions, setPermissions] = useState<PermissionRole[]>([
    { id: "1", role: "Admin", viewAll: true, editOwn: true, editAll: true, createNew: true, deleteOwn: true, deleteAll: true, exportData: true },
    { id: "2", role: "Manager", viewAll: true, editOwn: true, editAll: false, createNew: true, deleteOwn: true, deleteAll: false, exportData: true },
    { id: "3", role: "Employee", viewAll: false, editOwn: true, editAll: false, createNew: false, deleteOwn: false, deleteAll: false, exportData: false },
  ]);

  const handlePermissionChange = (roleId: string, permission: keyof PermissionRole, value: boolean) => {
    setPermissions(permissions.map(role => 
      role.id === roleId ? { ...role, [permission]: value } : role
    ));
  };

  const handleSavePermissions = () => {
    toast({
      title: "Permissions saved",
      description: "Your permission settings have been updated",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Set Permissions</DialogTitle>
          <DialogDescription>
            Control who can view and manage performance data
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex justify-center space-x-4 mb-4">
            <Button 
              variant={activeSection === "roles" ? "default" : "outline"} 
              onClick={() => setActiveSection("roles")}
            >
              Role Permissions
            </Button>
            <Button 
              variant={activeSection === "data" ? "default" : "outline"} 
              onClick={() => setActiveSection("data")}
            >
              Data Access
            </Button>
          </div>
          
          {activeSection === "roles" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Role-Based Permissions</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>View All</TableHead>
                    <TableHead>Edit Own</TableHead>
                    <TableHead>Edit All</TableHead>
                    <TableHead>Create New</TableHead>
                    <TableHead>Delete Own</TableHead>
                    <TableHead>Delete All</TableHead>
                    <TableHead>Export Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map(role => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.role}</TableCell>
                      <TableCell>
                        <Switch 
                          checked={role.viewAll} 
                          onCheckedChange={(checked) => handlePermissionChange(role.id, "viewAll", checked)}
                          disabled={role.role === "Admin"}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={role.editOwn} 
                          onCheckedChange={(checked) => handlePermissionChange(role.id, "editOwn", checked)}
                          disabled={role.role === "Admin"}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={role.editAll} 
                          onCheckedChange={(checked) => handlePermissionChange(role.id, "editAll", checked)}
                          disabled={role.role === "Admin"}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={role.createNew} 
                          onCheckedChange={(checked) => handlePermissionChange(role.id, "createNew", checked)}
                          disabled={role.role === "Admin"}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={role.deleteOwn} 
                          onCheckedChange={(checked) => handlePermissionChange(role.id, "deleteOwn", checked)}
                          disabled={role.role === "Admin"}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={role.deleteAll} 
                          onCheckedChange={(checked) => handlePermissionChange(role.id, "deleteAll", checked)}
                          disabled={role.role === "Admin"}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={role.exportData} 
                          onCheckedChange={(checked) => handlePermissionChange(role.id, "exportData", checked)}
                          disabled={role.role === "Admin"}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="text-sm text-muted-foreground">
                Note: Admin permissions cannot be modified
              </p>
            </div>
          )}
          
          {activeSection === "data" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Data Access Controls</h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Performance Reviews</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="manager-view-all" defaultChecked />
                      <span>Managers can view all team reviews</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="manager-export" defaultChecked />
                      <span>Managers can export team reviews</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Goals</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="employee-create-goals" defaultChecked />
                      <span>Employees can create personal goals</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="approval-required" defaultChecked />
                      <span>Goal approval required</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Analytics Data</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="employee-analytics" />
                      <span>Employees can view personal analytics</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="sensitive-data" defaultChecked />
                      <span>Hide sensitive data (salary, rankings)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSavePermissions}>
            <Save className="mr-2 h-4 w-4" />
            Save Permissions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
