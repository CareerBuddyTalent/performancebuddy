
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Users, Lock, Search, Plus, Edit, Trash2 } from "lucide-react";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
}

export function AdvancedPermissions() {
  const [selectedTab, setSelectedTab] = useState<'roles' | 'permissions' | 'users'>('roles');
  const [searchTerm, setSearchTerm] = useState("");

  const permissions: Permission[] = [
    { id: "view_analytics", name: "View Analytics", description: "Access to performance analytics dashboards", category: "Analytics", riskLevel: "low" },
    { id: "export_data", name: "Export Data", description: "Download performance and user data", category: "Data", riskLevel: "medium" },
    { id: "manage_users", name: "Manage Users", description: "Create, edit, and delete user accounts", category: "User Management", riskLevel: "high" },
    { id: "admin_settings", name: "Admin Settings", description: "Modify system-wide settings", category: "Administration", riskLevel: "high" },
    { id: "view_audit_logs", name: "View Audit Logs", description: "Access security and compliance logs", category: "Security", riskLevel: "medium" },
    { id: "manage_integrations", name: "Manage Integrations", description: "Configure third-party integrations", category: "Integrations", riskLevel: "medium" }
  ];

  const roles: Role[] = [
    { id: "employee", name: "Employee", description: "Standard employee access", userCount: 145, permissions: ["view_analytics"] },
    { id: "manager", name: "Manager", description: "Team management capabilities", userCount: 28, permissions: ["view_analytics", "export_data", "view_audit_logs"] },
    { id: "hr_admin", name: "HR Administrator", description: "Human resources management", userCount: 5, permissions: ["view_analytics", "export_data", "manage_users", "view_audit_logs"] },
    { id: "system_admin", name: "System Administrator", description: "Full system access", userCount: 2, permissions: ["view_analytics", "export_data", "manage_users", "admin_settings", "view_audit_logs", "manage_integrations"] }
  ];

  const getRiskBadge = (riskLevel: string) => {
    const variants = {
      low: { variant: "default" as const, text: "Low Risk" },
      medium: { variant: "secondary" as const, text: "Medium Risk" },
      high: { variant: "destructive" as const, text: "High Risk" }
    };
    
    const config = variants[riskLevel as keyof typeof variants] || variants.low;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const togglePermission = (roleId: string, permissionId: string) => {
    // Implementation for toggling permissions
    console.log(`Toggle permission ${permissionId} for role ${roleId}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Advanced Permission Management
          </CardTitle>
          <CardDescription>
            Configure granular role-based access controls and security permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button 
              variant={selectedTab === 'roles' ? 'default' : 'outline'} 
              onClick={() => setSelectedTab('roles')}
            >
              Roles
            </Button>
            <Button 
              variant={selectedTab === 'permissions' ? 'default' : 'outline'} 
              onClick={() => setSelectedTab('permissions')}
            >
              Permissions
            </Button>
            <Button 
              variant={selectedTab === 'users' ? 'default' : 'outline'} 
              onClick={() => setSelectedTab('users')}
            >
              User Assignment
            </Button>
          </div>

          {selectedTab === 'roles' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Input
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Role
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {role.userCount}
                        </div>
                      </TableCell>
                      <TableCell>{role.permissions.length} permissions</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {selectedTab === 'permissions' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Input
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Permission
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Permission</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">{permission.name}</TableCell>
                      <TableCell>{permission.description}</TableCell>
                      <TableCell>{permission.category}</TableCell>
                      <TableCell>{getRiskBadge(permission.riskLevel)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {selectedTab === 'users' && (
            <div className="space-y-6">
              <div className="grid gap-6">
                {roles.map((role) => (
                  <Card key={role.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <p className="font-medium">{permission.name}</p>
                                {getRiskBadge(permission.riskLevel)}
                              </div>
                              <p className="text-sm text-muted-foreground">{permission.description}</p>
                            </div>
                            <Switch 
                              checked={role.permissions.includes(permission.id)}
                              onCheckedChange={() => togglePermission(role.id, permission.id)}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
