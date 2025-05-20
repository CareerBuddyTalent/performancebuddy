
import { User } from "@/types/user";

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  requestReview: (revieweeId: string) => Promise<void>;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
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
