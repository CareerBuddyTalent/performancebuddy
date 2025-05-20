
import { User } from "@/types";
import { Session, AuthResponse } from "@supabase/supabase-js";

// Add this interface to handle auth state
export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authError: string | null;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (email: string, password: string, userData?: Record<string, any>) => Promise<AuthResponse>;
  logout: () => Promise<{ error: Error | null }>;
  isLoading: boolean;
  isAuthenticated: boolean;
  requestReview?: (managerId: string) => Promise<boolean>;
  switchRole?: (role: User['role']) => Promise<void>;
}
