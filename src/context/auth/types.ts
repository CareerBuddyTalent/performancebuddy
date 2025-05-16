
import { User, UserRole } from '@/types/user';
import { Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  isLoading: boolean;
  requestReview: (managerId: string, comments?: string) => Promise<boolean>;
  authError: string | null;
  clearAuthError: () => void;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  authError: string | null;
}
