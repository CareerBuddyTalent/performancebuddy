
import { ReactNode } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/layout/AppHeader";
import RoleGuard from "@/components/layout/RoleGuard";

interface PageLayoutProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function PageLayout({ children, allowedRoles = ['admin', 'manager', 'employee'] }: PageLayoutProps) {
  return (
    <RoleGuard allowedRoles={allowedRoles}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <AppHeader />
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </RoleGuard>
  );
}
