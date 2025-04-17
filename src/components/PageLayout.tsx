import { ReactNode, useState } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import CompanySelector from "@/components/CompanySelector";
import { useCompany } from "@/context/CompanyContext";
import { useAuth } from "@/context/AuthContext";
import { useNotificationContext } from "@/context/NotificationContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, LayoutGrid } from "lucide-react";
import NotificationPopover from "@/components/dashboard/NotificationPopover";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface PageLayoutProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function PageLayout({ children, allowedRoles = ['admin', 'manager', 'employee'] }: PageLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { companies, currentCompany } = useCompany();
  const { user } = useAuth();
  const { unreadCount } = useNotificationContext();
  const [layoutGridOpen, setLayoutGridOpen] = useState(false);

  // Check if user has required role
  if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleNavigate = (path: string) => {
    navigate(path);
    setLayoutGridOpen(false);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="hidden md:block text-xl font-semibold capitalize">
                {location.pathname.replace('/', '') || 'Home'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => navigate('/home')}
              >
                <Search className="h-5 w-5" />
              </button>
              <NotificationPopover />
              
              <DropdownMenu open={layoutGridOpen} onOpenChange={setLayoutGridOpen}>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label="Quick Access"
                  >
                    <LayoutGrid className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => handleNavigate('/home')}>
                    Home
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigate('/dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  {(user?.role === 'admin' || user?.role === 'manager') && (
                    <DropdownMenuItem onClick={() => handleNavigate('/performance')}>
                      Performance
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleNavigate('/goals')}>
                    Goals
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigate('/feedback')}>
                    Feedback
                  </DropdownMenuItem>
                  {(user?.role === 'admin' || user?.role === 'manager') && (
                    <DropdownMenuItem onClick={() => handleNavigate('/users')}>
                      Team Members
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="flex items-center gap-2 border-l pl-4 ml-2">
                {currentCompany && (
                  <CompanySelector 
                    companies={companies} 
                    selectedCompanyId={currentCompany.id} 
                    onCompanyChange={id => {
                      const company = companies.find(c => c.id === id);
                      if (company) {
                        // This is handled by the CompanyContext
                      }
                    }} 
                  />
                )}
              </div>
              {user && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profilePicture} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
