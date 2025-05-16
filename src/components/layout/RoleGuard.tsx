
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, session, isLoading } = useAuth();
  const location = useLocation();

  // For debugging purposes
  useEffect(() => {
    console.log("RoleGuard - Current user:", user);
    console.log("RoleGuard - Current session:", session ? "exists" : "null");
    console.log("RoleGuard - Allowed roles:", allowedRoles);
    console.log("RoleGuard - Is loading:", isLoading);
  }, [user, session, allowedRoles, isLoading]);

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
        <span className="ml-2 text-muted-foreground">Verifying access...</span>
      </div>
    );
  }

  // Prioritize checking session for production, fall back to user check for development
  const isAuthenticated = session || (process.env.NODE_ENV === 'development' && user);
  
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
  console.log("RoleGuard - Access granted");
  return <>{children}</>;
}
