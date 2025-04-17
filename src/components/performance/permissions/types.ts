
export interface PermissionRole {
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
