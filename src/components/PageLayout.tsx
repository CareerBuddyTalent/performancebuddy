
import { ReactNode, useState } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import CompanySelector from "@/components/CompanySelector";
import { useCompany } from "@/context/CompanyContext";
import { useAuth } from "@/context/AuthContext";
import { useNotificationContext } from "@/context/NotificationContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  LayoutGrid, 
  LogOut, 
  User, 
  Settings, 
  Home, 
  Target, 
  BarChart,
  Users,
} from "lucide-react";
import NotificationPopover from "@/components/dashboard/NotificationPopover";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface PageLayoutProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function PageLayout({ children, allowedRoles = ['admin', 'manager', 'employee'] }: PageLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { companies, currentCompany } = useCompany();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotificationContext();
  const [layoutGridOpen, setLayoutGridOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Check if user has required role
  if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleNavigate = (path: string) => {
    navigate(path);
    setLayoutGridOpen(false);
  };

  const getPageTitle = () => {
    if (location.pathname === '/') return 'Dashboard';
    return location.pathname.split('/')[1].replace('-', ' ').replace(/^\w/, c => c.toUpperCase()) || 'Home';
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="hidden md:block text-xl font-semibold capitalize">
                {getPageTitle()}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors dark:hover:bg-gray-800 dark:hover:text-gray-200"
                onClick={() => navigate('/home')}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              
              <NotificationPopover />
              
              <DropdownMenu open={layoutGridOpen} onOpenChange={setLayoutGridOpen}>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    aria-label="Quick Access"
                  >
                    <LayoutGrid className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2">
                  <DropdownMenuLabel>Quick Access</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => handleNavigate('/home')} className="cursor-pointer">
                      <Home className="h-4 w-4 mr-2" />
                      Home
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigate('/dashboard')} className="cursor-pointer">
                      <BarChart className="h-4 w-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigate('/goals')} className="cursor-pointer">
                      <Target className="h-4 w-4 mr-2" />
                      Goals
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => handleNavigate('/my-profile')} className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </DropdownMenuItem>
                    {(user?.role === 'admin' || user?.role === 'manager') && (
                      <DropdownMenuItem onClick={() => handleNavigate('/users')} className="cursor-pointer">
                        <Users className="h-4 w-4 mr-2" />
                        Team Members
                      </DropdownMenuItem>
                    )}
                    {(user?.role === 'admin' || user?.role === 'manager') && (
                      <DropdownMenuItem onClick={() => handleNavigate('/performance')} className="cursor-pointer">
                        <BarChart className="h-4 w-4 mr-2" />
                        Performance
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="hidden md:flex items-center gap-2 border-l pl-4 ml-2">
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
              
              <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                <DropdownMenuTrigger asChild>
                  {user && (
                    <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-primary/10 transition-all hover:ring-4">
                      <AvatarImage src={user.profilePicture} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profilePicture} alt={user?.name || ''} />
                      <AvatarFallback>{user?.name?.charAt(0) || ''}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate('/my-profile')} className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-red-500 focus:text-red-500">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
