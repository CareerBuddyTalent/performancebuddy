
export type PermissionAction = 
  'view_analytics' | 
  'create_review' | 
  'manage_reviews' | 
  'view_reports' | 
  'manage_cycles' | 
  'manage_templates' |
  'export_data';

export type UserRole = 'employee' | 'manager' | 'admin';

const rolePermissions: Record<UserRole, PermissionAction[]> = {
  admin: [
    'view_analytics',
    'create_review',
    'manage_reviews',
    'view_reports',
    'manage_cycles',
    'manage_templates',
    'export_data'
  ],
  manager: [
    'view_analytics',
    'create_review',
    'manage_reviews',
    'view_reports',
    'manage_templates'
  ],
  employee: [
    'view_analytics'
  ]
};

export function hasPermission(role: string, action: PermissionAction): boolean {
  return rolePermissions[role as UserRole]?.includes(action) || false;
}
