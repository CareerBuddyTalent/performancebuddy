
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
  department?: string;
  position?: string;
  manager?: string;
  skills?: string[]; // IDs of skills the user has
  competencyLevel?: Record<string, number>; // Skill ID to level (1-5) mapping
  companyId?: string; // Reference to the company
  company?: Company; // Company object
  bio?: string;
}
