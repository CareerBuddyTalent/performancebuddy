
import React, { createContext, useContext, ReactNode, useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { User } from '@/types';
import { RoleSyncService } from '@/services/roleSync';
import { FallbackAuthProvider, useFallbackAuth } from './FallbackAuthContext';
import env from '@/config/env';

interface ClerkAuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isClerkAvailable: boolean;
  login?: (email: string, password: string) => Promise<boolean>;
  signup?: (name: string, email: string, password: string) => Promise<boolean>;
}

const ClerkAuthContext = createContext<ClerkAuthContextType | undefined>(undefined);

// Cache for user roles to avoid repeated database calls
const roleCache = new Map<string, { role: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const ClerkAuthProviderInner: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clerkError, setClerkError] = useState(false);

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
      try {
        await RoleSyncService.syncUserProfile(userProfile);
        
        // Validate role from database
        const dbRole = await RoleSyncService.validateUserRole(clerkUser.id);
        if (dbRole && dbRole !== userProfile.role) {
          userProfile.role = dbRole as 'admin' | 'manager' | 'employee';
          setCachedRole(clerkUser.id, dbRole);
        } else {
          setCachedRole(clerkUser.id, userProfile.role);
        }
      } catch (supabaseError) {
        console.warn('Supabase sync failed, using Clerk data:', supabaseError);
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
    // Check if Clerk is working with improved error handling
    const checkClerk = async () => {
      try {
        if (!env.CLERK_PUBLISHABLE_KEY) {
          console.warn('No Clerk publishable key found, using fallback auth');
          setClerkError(true);
          setIsLoading(false);
          return;
        }

        // Wait for Clerk to initialize
        let attempts = 0;
        const maxAttempts = 10;
        
        while (attempts < maxAttempts && !isLoaded) {
          await new Promise(resolve => setTimeout(resolve, 200));
          attempts++;
        }
        
        if (isLoaded) {
          if (clerkUser) {
            await syncAndSetUser(clerkUser);
          } else {
            setUser(null);
            setIsLoading(false);
          }
        } else {
          // Clerk didn't load after reasonable time, use fallback
          console.warn('Clerk failed to load, using fallback authentication');
          setClerkError(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.warn('Clerk initialization failed, using fallback:', error);
        setClerkError(true);
        setIsLoading(false);
      }
    };

    checkClerk();
  }, [isLoaded, clerkUser, syncAndSetUser]);

  const logout = useCallback(async () => {
    if (user) {
      roleCache.delete(user.id);
    }
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setUser(null);
  }, [signOut, user]);

  const value: ClerkAuthContextType = useMemo(() => ({
    user,
    isLoading: isLoading,
    isAuthenticated: !!isSignedIn && !!user && !clerkError,
    logout,
    refreshUser,
    isClerkAvailable: !clerkError
  }), [user, isLoading, isSignedIn, logout, refreshUser, clerkError]);

  return (
    <ClerkAuthContext.Provider value={value}>
      {children}
    </ClerkAuthContext.Provider>
  );
};

// Fallback wrapper component
const FallbackWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const fallbackAuth = useFallbackAuth();
  
  const value: ClerkAuthContextType = useMemo(() => ({
    ...fallbackAuth,
    isClerkAvailable: false
  }), [fallbackAuth]);

  return (
    <ClerkAuthContext.Provider value={value}>
      {children}
    </ClerkAuthContext.Provider>
  );
};

export const ClerkAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Check if Clerk is available
  if (!env.CLERK_PUBLISHABLE_KEY) {
    return (
      <FallbackAuthProvider>
        <FallbackWrapper>{children}</FallbackWrapper>
      </FallbackAuthProvider>
    );
  }

  return <ClerkAuthProviderInner>{children}</ClerkAuthProviderInner>;
};

export const useClerkAuth = () => {
  const context = useContext(ClerkAuthContext);
  if (context === undefined) {
    throw new Error('useClerkAuth must be used within a ClerkAuthProvider');
  }
  return context;
};
