
export type PermissionAction = 
  'view_analytics' | 
  'create_review' | 
  'manage_reviews' | 
  'view_reports' | 
  'manage_cycles' | 
  'manage_templates' |
  'export_data' |
  'manage_team_goals' | // Adding missing permission
  'view_all_goals' |    // Adding missing permission
  'manage_settings';    // Adding missing permission

export type UserRole = 'employee' | 'manager' | 'admin';

const rolePermissions: Record<UserRole, PermissionAction[]> = {
  admin: [
    'view_analytics',
    'create_review',
    'manage_reviews',
    'view_reports',
    'manage_cycles',
    'manage_templates',
    'export_data',
    'manage_team_goals',
    'view_all_goals',
    'manage_settings'
  ],
  manager: [
    'view_analytics',
    'create_review',
    'manage_reviews',
    'view_reports',
    'manage_templates',
    'manage_team_goals',
    'view_all_goals'
  ],
  employee: [
    'view_analytics'
  ]
};

export function hasPermission(role: string, action: PermissionAction): boolean {
  return rolePermissions[role as UserRole]?.includes(action) || false;
}
