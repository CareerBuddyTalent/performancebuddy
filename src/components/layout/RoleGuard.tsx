
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user } = useAuth();

  // Debug
  console.log("RoleGuard - Current user:", user);
  console.log("RoleGuard - Allowed roles:", allowedRoles);

  // If user is not authenticated, redirect to login
  if (!user) {
    console.log("RoleGuard - User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log(`RoleGuard - User role ${user.role} not in allowed roles, redirecting to dashboard`);
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has required role
  console.log("RoleGuard - Access granted");
  return <>{children}</>;
}
