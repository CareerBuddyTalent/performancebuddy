
import { User, UserRole } from '@/types';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isLoading: boolean;
  requestReview: (managerId: string, comments?: string) => Promise<boolean>;
}
