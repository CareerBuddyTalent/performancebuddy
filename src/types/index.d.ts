
export type UserRole = 'employee' | 'manager' | 'admin';

export interface Company {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
  avatar?: string;
  department?: string;
  position?: string;
  manager?: string;
  skills?: string[];
  competencyLevel?: Record<string, number>;
  companyId?: string;
  company?: Company;
  bio?: string;
  location?: string;
  joinDate?: Date;
}
