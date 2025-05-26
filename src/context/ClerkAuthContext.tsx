
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { User } from '@/types';

interface ClerkAuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const ClerkAuthContext = createContext<ClerkAuthContextType | undefined>(undefined);

export const ClerkAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const { user: clerkUser } = useUser();

  // Convert Clerk user to our User type
  const user: User | null = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress || '',
    name: clerkUser.fullName || clerkUser.firstName || 'User',
    role: (clerkUser.publicMetadata?.role as 'admin' | 'manager' | 'employee') || 'employee',
    profilePicture: clerkUser.imageUrl
  } : null;

  const logout = async () => {
    await signOut();
  };

  const value: ClerkAuthContextType = {
    user,
    isLoading: !isLoaded,
    isAuthenticated: !!isSignedIn,
    logout
  };

  return (
    <ClerkAuthContext.Provider value={value}>
      {children}
    </ClerkAuthContext.Provider>
  );
};

export const useClerkAuth = () => {
  const context = useContext(ClerkAuthContext);
  if (context === undefined) {
    throw new Error('useClerkAuth must be used within a ClerkAuthProvider');
  }
  return context;
};
