
import { ReactNode, useEffect, memo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import { GlobalLoading } from "@/components/ui/global-loading";
import analytics from "@/services/analytics";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // For debugging purposes
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("RoleGuard - Current user:", user);
      console.log("RoleGuard - Is authenticated:", isAuthenticated);
      console.log("RoleGuard - Allowed roles:", allowedRoles);
      console.log("RoleGuard - Is loading:", isLoading);
    }
  }, [user, isAuthenticated, allowedRoles, isLoading]);

  // Show loading state while authentication is being checked
  if (isLoading) {
    return <GlobalLoading message="Verifying access..." />;
  }
  
  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("RoleGuard - User not authenticated, redirecting to login");
    // Track access denied event
    analytics.track('access_denied', { 
      reason: 'not_authenticated', 
      requested_path: location.pathname 
    });
    // Store the current path to redirect back after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if user has required role
  if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log(`RoleGuard - User role ${user.role} not in allowed roles, redirecting to dashboard`);
    // Track access denied event
    analytics.track('access_denied', {
      reason: 'insufficient_permissions',
      user_role: user.role,
      required_roles: allowedRoles.join(','),
      requested_path: location.pathname
    });
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has required role
  if (import.meta.env.DEV) {
    console.log("RoleGuard - Access granted");
  }
  return <>{children}</>;
}

// Use memo to prevent unnecessary re-renders
export default memo(RoleGuard);
