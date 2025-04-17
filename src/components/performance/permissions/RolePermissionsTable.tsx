
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

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

interface RolePermissionsTableProps {
  permissions: PermissionRole[];
  onPermissionChange: (roleId: string, permission: keyof PermissionRole, value: boolean) => void;
}

export default function RolePermissionsTable({ permissions, onPermissionChange }: RolePermissionsTableProps) {
  return (
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
                  onCheckedChange={(checked) => onPermissionChange(role.id, "viewAll", checked)}
                  disabled={role.role === "Admin"}
                />
              </TableCell>
              <TableCell>
                <Switch 
                  checked={role.editOwn} 
                  onCheckedChange={(checked) => onPermissionChange(role.id, "editOwn", checked)}
                  disabled={role.role === "Admin"}
                />
              </TableCell>
              <TableCell>
                <Switch 
                  checked={role.editAll} 
                  onCheckedChange={(checked) => onPermissionChange(role.id, "editAll", checked)}
                  disabled={role.role === "Admin"}
                />
              </TableCell>
              <TableCell>
                <Switch 
                  checked={role.createNew} 
                  onCheckedChange={(checked) => onPermissionChange(role.id, "createNew", checked)}
                  disabled={role.role === "Admin"}
                />
              </TableCell>
              <TableCell>
                <Switch 
                  checked={role.deleteOwn} 
                  onCheckedChange={(checked) => onPermissionChange(role.id, "deleteOwn", checked)}
                  disabled={role.role === "Admin"}
                />
              </TableCell>
              <TableCell>
                <Switch 
                  checked={role.deleteAll} 
                  onCheckedChange={(checked) => onPermissionChange(role.id, "deleteAll", checked)}
                  disabled={role.role === "Admin"}
                />
              </TableCell>
              <TableCell>
                <Switch 
                  checked={role.exportData} 
                  onCheckedChange={(checked) => onPermissionChange(role.id, "exportData", checked)}
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
  );
}
