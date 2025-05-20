
import { User } from "@/types";
import { Session, AuthResponse } from "@supabase/supabase-js";

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (email: string, password: string, userData?: Record<string, any>) => Promise<AuthResponse>;
  logout: () => Promise<{ error: Error | null }>;
  isLoading: boolean;
}
