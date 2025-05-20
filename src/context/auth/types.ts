
import { User } from "@/types/user";

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  isAuthenticated: boolean;
  authError: string | null;
  clearAuthError: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole?: (role: string) => void;
  requestReview: (revieweeId: string) => Promise<boolean>;
  session?: any;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  session: any | null;
  authError: string | null;
}

export type AuthAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGOUT' };

export interface Session {
  user: {
    id: string;
    email: string;
  };
  access_token: string;
  refresh_token: string;
}
