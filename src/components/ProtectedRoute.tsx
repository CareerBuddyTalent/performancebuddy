
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export default function ProtectedRoute({ children, requiredRoles = [] }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  // If still loading auth state, show a loading spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
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
