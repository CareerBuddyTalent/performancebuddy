
import { ReactNode } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useClerkAuth } from "@/context/ClerkAuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

export function ProtectedRoute({ children, requiredRoles = [] }: ProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const { user, isAuthenticated, isLoading, isClerkAvailable } = useClerkAuth();
  const location = useLocation();

  // Show loading only if Clerk is available and still loading
  if (isClerkAvailable && (!isLoaded || isLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Check authentication based on available service
  const userIsAuthenticated = isClerkAvailable ? isSignedIn : isAuthenticated;

  if (!userIsAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
