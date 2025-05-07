
import { ReactNode } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/layout/AppHeader";
import Footer from "@/components/layout/Footer";
import RoleGuard from "@/components/layout/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";

interface PageLayoutProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function PageLayout({ children, allowedRoles = ['admin', 'manager', 'employee'] }: PageLayoutProps) {
  const { isLoading } = useAuth();

  // Show a loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" />
          <p className="text-muted-foreground">Loading application...</p>
        </div>
      </div>
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
