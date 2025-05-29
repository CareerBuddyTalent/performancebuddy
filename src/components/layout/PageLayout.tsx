
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/layout/AppHeader";
import Footer from "@/components/layout/Footer";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { DashboardSkeleton } from "@/components/ui/optimized-skeleton";

export default function PageLayout() {
  const { isLoading, isAuthenticated } = useSupabaseAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full bg-background">
        <div className="w-64 border-r bg-card">
          <div className="p-4">
            <div className="h-8 w-32 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="flex-1">
          <div className="h-14 border-b bg-background/95 animate-pulse" />
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-muted-foreground">Authentication required. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
