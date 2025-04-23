
export type PerformanceAction = 
  | 'view_all_goals'
  | 'manage_all_goals'
  | 'view_team_goals'
  | 'manage_team_goals'
  | 'view_settings'
  | 'manage_settings'
  | 'view_analytics'
  | 'manage_analytics';

export const rolePermissions: Record<string, PerformanceAction[]> = {
  manager: [
    'view_all_goals',
    'manage_all_goals',
    'view_team_goals',
    'manage_team_goals',
    'view_settings',
    'view_analytics'
  ],
  employee: [
    'view_team_goals'
  ]
};

export const hasPermission = (role: string, action: PerformanceAction): boolean => {
  return rolePermissions[role]?.includes(action) ?? false;
};
