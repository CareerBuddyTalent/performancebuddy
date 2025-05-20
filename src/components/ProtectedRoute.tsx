
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export default function ProtectedRoute({ children, requiredRoles = [] }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  
  // If still loading auth state, show nothing (or a loading spinner)
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If role check is required and user doesn't have necessary role
  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    // Redirect to an unauthorized page or dashboard
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
}
