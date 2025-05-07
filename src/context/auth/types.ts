
import { User, UserRole } from '@/types/user';

export interface AuthContextType {
  user: User | null;
  session: any | null; // Add session to the context
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isLoading: boolean;
  requestReview: (managerId: string, comments?: string) => Promise<boolean>;
  authError: string | null;
  clearAuthError: () => void;
}
