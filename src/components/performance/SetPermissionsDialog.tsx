
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import RolePermissionsTable from "./permissions/RolePermissionsTable";
import DataAccessControls from "./permissions/DataAccessControls";
import { PermissionRole } from "./permissions/types";

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
            <RolePermissionsTable 
              permissions={permissions} 
              onPermissionChange={handlePermissionChange} 
            />
          )}
          
          {activeSection === "data" && <DataAccessControls />}
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
