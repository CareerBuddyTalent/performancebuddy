import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutGrid, Target, BarChart, ChartPie, Users, User, Book } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import CompanySelector from "@/components/CompanySelector";
import { useCompany } from "@/context/CompanyContext";
import { useAuth } from "@/context/AuthContext";
import UserMenuDropdown from "@/components/layout/UserMenuDropdown";
import NotificationPopover from "@/components/dashboard/NotificationPopover";

export default function AppHeader() {
  const navigate = useNavigate();
  const { companies, currentCompany } = useCompany();
  const { user } = useAuth();
  const [layoutGridOpen, setLayoutGridOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    setLayoutGridOpen(false);
  };

  const getPageTitle = () => {
    const pathname = window.location.pathname;
    if (pathname === '/') return 'Dashboard';
    return pathname.split('/')[1].replace('-', ' ').replace(/^\w/, c => c.toUpperCase()) || 'Dashboard';
  };

  const canAccessPerformance = user && (user.role === 'admin' || user.role === 'manager');
  const isAdmin = user?.role === 'admin';

  return (
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
          onClick={() => handleNavigate('/dashboard')}
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
              <DropdownMenuItem onClick={() => handleNavigate('/dashboard')} className="cursor-pointer">
                <BarChart className="h-4 w-4 mr-2" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigate('/goals')} className="cursor-pointer">
                <Target className="h-4 w-4 mr-2" />
                Goals
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigate('/skills')} className="cursor-pointer">
                <Book className="h-4 w-4 mr-2" />
                Skills
              </DropdownMenuItem>
              {canAccessPerformance && (
                <DropdownMenuItem onClick={() => handleNavigate('/performance')} className="cursor-pointer">
                  <ChartPie className="h-4 w-4 mr-2" />
                  Performance
                </DropdownMenuItem>
              )}
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
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {isAdmin && currentCompany && (
          <div className="hidden md:flex items-center gap-2 border-l pl-4 ml-2">
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
          </div>
        )}
        
        <UserMenuDropdown />
      </div>
    </header>
  );
}
