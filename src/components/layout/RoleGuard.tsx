
import { ReactNode, useEffect, memo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useClerkAuth } from "@/context/ClerkAuthContext";
import { GlobalLoading } from "@/components/ui/global-loading";
import analytics from "@/services/analytics";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useClerkAuth();
  const location = useLocation();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("RoleGuard - Current user:", user);
      console.log("RoleGuard - Is authenticated:", isAuthenticated);
      console.log("RoleGuard - Allowed roles:", allowedRoles);
      console.log("RoleGuard - Is loading:", isLoading);
    }
  }, [user, isAuthenticated, allowedRoles, isLoading]);

  if (isLoading) {
    return <GlobalLoading message="Verifying access..." />;
  }
  
  if (!isAuthenticated) {
    console.log("RoleGuard - User not authenticated, redirecting to login");
    analytics.track('access_denied', { 
      reason: 'not_authenticated', 
      requested_path: location.pathname 
    });
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log(`RoleGuard - User role ${user.role} not in allowed roles, redirecting to dashboard`);
    analytics.track('access_denied', {
      reason: 'insufficient_permissions',
      user_role: user.role,
      required_roles: allowedRoles.join(','),
      requested_path: location.pathname
    });
    return <Navigate to="/dashboard" replace />;
  }

  if (import.meta.env.DEV) {
    console.log("RoleGuard - Access granted");
  }
  return <>{children}</>;
}

export default memo(RoleGuard);
