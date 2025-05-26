
import { ReactNode } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/layout/AppHeader";
import Footer from "@/components/layout/Footer";
import RoleGuard from "@/components/layout/RoleGuard";
import { useClerkAuth } from "@/context/ClerkAuthContext";
import { GlobalLoading } from "@/components/ui/global-loading";

interface PageLayoutProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function PageLayout({ children, allowedRoles = ['admin', 'manager', 'employee'] }: PageLayoutProps) {
  const { isLoading, isAuthenticated } = useClerkAuth();

  if (isLoading) {
    return <GlobalLoading message="Loading application..." fullScreen />;
  }

  if (!isAuthenticated) {
    return (
      <RoleGuard allowedRoles={allowedRoles}>
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-muted-foreground">Authentication required. Redirecting to login...</p>
          </div>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={allowedRoles}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <AppHeader />
            <main className="flex-1 p-6">{children}</main>
            <Footer />
          </div>
        </div>
      </SidebarProvider>
    </RoleGuard>
  );
}
