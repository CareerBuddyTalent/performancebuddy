
import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { User } from '@/types';
import { RoleSyncService } from '@/services/roleSync';

interface ClerkAuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const ClerkAuthContext = createContext<ClerkAuthContextType | undefined>(undefined);

export const ClerkAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncAndSetUser = async (clerkUser: any) => {
    try {
      setIsLoading(true);
      
      // Convert Clerk user to our User type
      const userProfile: User = {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: clerkUser.fullName || clerkUser.firstName || 'User',
        role: (clerkUser.publicMetadata?.role as 'admin' | 'manager' | 'employee') || 'employee',
        profilePicture: clerkUser.imageUrl
      };

      // Sync with Supabase
      await RoleSyncService.syncUserProfile(userProfile);
      
      // Validate role from database
      const dbRole = await RoleSyncService.validateUserRole(clerkUser.id);
      if (dbRole && dbRole !== userProfile.role) {
        userProfile.role = dbRole as 'admin' | 'manager' | 'employee';
      }

      setUser(userProfile);
    } catch (error) {
      console.error('Error syncing user:', error);
      // Still set user even if sync fails
      const userProfile: User = {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: clerkUser.fullName || clerkUser.firstName || 'User',
        role: (clerkUser.publicMetadata?.role as 'admin' | 'manager' | 'employee') || 'employee',
        profilePicture: clerkUser.imageUrl
      };
      setUser(userProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    if (clerkUser) {
      await syncAndSetUser(clerkUser);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      if (clerkUser) {
        syncAndSetUser(clerkUser);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    }
  }, [isLoaded, clerkUser]);

  const logout = async () => {
    await signOut();
    setUser(null);
  };

  const value: ClerkAuthContextType = {
    user,
    isLoading: !isLoaded || isLoading,
    isAuthenticated: !!isSignedIn && !!user,
    logout,
    refreshUser
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
