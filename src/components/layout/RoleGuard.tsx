
import { ReactNode, useEffect, memo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";

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
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center space-x-2">
          <Spinner size="lg" />
          <span className="ml-2 text-muted-foreground">Verifying access...</span>
        </div>
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("RoleGuard - User not authenticated, redirecting to login");
    // Store the current path to redirect back after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if user has required role
  if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log(`RoleGuard - User role ${user.role} not in allowed roles, redirecting to dashboard`);
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
