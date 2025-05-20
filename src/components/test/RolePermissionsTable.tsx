
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Check, X, Minus } from "lucide-react";
import { hasPermission, PermissionAction } from "@/types/performance-permissions";

// Define the actions we want to test for each role
const testActions: { action: PermissionAction; description: string }[] = [
  { action: 'view_analytics', description: 'View analytics dashboards' },
  { action: 'create_review', description: 'Create new reviews' },
  { action: 'manage_reviews', description: 'Manage all reviews' },
  { action: 'view_reports', description: 'View performance reports' },
  { action: 'manage_cycles', description: 'Manage review cycles' },
  { action: 'manage_templates', description: 'Manage review templates' },
  { action: 'export_data', description: 'Export performance data' },
  { action: 'manage_team_goals', description: 'Manage team OKRs' },
  { action: 'view_all_goals', description: 'View organization goals' },
  { action: 'manage_settings', description: 'Manage app settings' },
];

// Component to display the role permissions table
export default function RolePermissionsTable() {
  const roles = ['admin', 'manager', 'employee'];
  
  // Render permission indicator icon
  const renderPermissionIcon = (hasAccess: boolean) => {
    return hasAccess ? (
      <Check className="h-4 w-4 text-green-600" />
    ) : (
      <X className="h-4 w-4 text-red-600" />
    );
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Action</TableHead>
            {roles.map((role) => (
              <TableHead key={role} className="text-center">
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {testActions.map((actionInfo) => (
            <TableRow key={actionInfo.action}>
              <TableCell>
                <div>
                  <div className="font-medium">{actionInfo.action}</div>
                  <div className="text-xs text-muted-foreground">{actionInfo.description}</div>
                </div>
              </TableCell>
              {roles.map((role) => (
                <TableCell key={`${role}-${actionInfo.action}`} className="text-center">
                  {renderPermissionIcon(hasPermission(role, actionInfo.action))}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
