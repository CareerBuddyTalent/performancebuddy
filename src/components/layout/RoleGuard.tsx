
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user } = useAuth();

  // Check if user has required role
  if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
