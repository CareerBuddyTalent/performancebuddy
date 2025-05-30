
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { User } from '@/types';

export interface SupabaseAuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  sessionTimeLeft: number | null;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  sessionTimeLeft: number | null;
}
