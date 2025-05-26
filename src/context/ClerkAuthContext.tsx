
import React, { createContext, useContext, ReactNode, useEffect, useState, useCallback, useMemo } from 'react';
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

// Cache for user roles to avoid repeated database calls
const roleCache = new Map<string, { role: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const ClerkAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCachedRole = useCallback((userId: string): string | null => {
    const cached = roleCache.get(userId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.role;
    }
    return null;
  }, []);

  const setCachedRole = useCallback((userId: string, role: string) => {
    roleCache.set(userId, { role, timestamp: Date.now() });
  }, []);

  const syncAndSetUser = useCallback(async (clerkUser: any) => {
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

      // Check cache first
      const cachedRole = getCachedRole(clerkUser.id);
      if (cachedRole) {
        userProfile.role = cachedRole as 'admin' | 'manager' | 'employee';
        setUser(userProfile);
        setIsLoading(false);
        return;
      }

      // Sync with Supabase only if not cached
      await RoleSyncService.syncUserProfile(userProfile);
      
      // Validate role from database
      const dbRole = await RoleSyncService.validateUserRole(clerkUser.id);
      if (dbRole && dbRole !== userProfile.role) {
        userProfile.role = dbRole as 'admin' | 'manager' | 'employee';
        setCachedRole(clerkUser.id, dbRole);
      } else {
        setCachedRole(clerkUser.id, userProfile.role);
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
  }, [getCachedRole, setCachedRole]);

  const refreshUser = useCallback(async () => {
    if (clerkUser) {
      // Clear cache for this user to force refresh
      roleCache.delete(clerkUser.id);
      await syncAndSetUser(clerkUser);
    }
  }, [clerkUser, syncAndSetUser]);

  useEffect(() => {
    if (isLoaded) {
      if (clerkUser) {
        syncAndSetUser(clerkUser);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    }
  }, [isLoaded, clerkUser, syncAndSetUser]);

  const logout = useCallback(async () => {
    if (user) {
      roleCache.delete(user.id);
    }
    await signOut();
    setUser(null);
  }, [signOut, user]);

  const value: ClerkAuthContextType = useMemo(() => ({
    user,
    isLoading: !isLoaded || isLoading,
    isAuthenticated: !!isSignedIn && !!user,
    logout,
    refreshUser
  }), [user, isLoaded, isLoading, isSignedIn, logout, refreshUser]);

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
