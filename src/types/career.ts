
export interface CareerRole {
  id: string;
  title: string;
  years_experience: string;
}

export interface CareerPath {
  id: string;
  title: string;
  color: string;
  roles: CareerRole[];
}

// Add the Role interface for RoleMapping component
export interface Role {
  id: string;
  title: string;
  department: string;
  skills: string[];
}
