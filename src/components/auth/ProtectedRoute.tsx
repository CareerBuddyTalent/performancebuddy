
import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

export function ProtectedRoute({ children, requiredRoles = [] }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect to login if not authenticated
      navigate("/login", {
        state: { from: location.pathname },
        replace: true
      });
    }
    
    if (!isLoading && user && requiredRoles.length > 0) {
      // Check if user has required role
      if (!requiredRoles.includes(user.role)) {
        navigate("/unauthorized", { replace: true });
      }
    }
  }, [user, isLoading, navigate, location.pathname, requiredRoles]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // If not loading and we have a user, render children
  return user ? <>{children}</> : null;
}
