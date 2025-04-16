
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  useSidebar 
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  BarChart4, 
  FileText, 
  Users, 
  Target, 
  MessageSquareMore, 
  Search, 
  Settings, 
  LogOut, 
  User, 
  Home 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function AppSidebar() {
  const { user, logout, switchRole } = useAuth();
  const location = useLocation();
  const sidebar = useSidebar();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  if (!user) return null;

  // Define menus based on user role
  const adminMenuItems = [
    { to: "/", icon: <Home />, label: "Home" },
    { to: "/dashboard", icon: <BarChart4 />, label: "Dashboard" },
    { to: "/employees", icon: <Users />, label: "Employees" },
    { to: "/reviews", icon: <FileText />, label: "Reviews" },
    { to: "/parameters", icon: <Settings />, label: "Parameters" },
  ];

  const managerMenuItems = [
    { to: "/", icon: <Home />, label: "Home" },
    { to: "/dashboard", icon: <BarChart4 />, label: "Dashboard" },
    { to: "/team", icon: <Users />, label: "My Team" },
    { to: "/reviews", icon: <FileText />, label: "Reviews" },
  ];

  const employeeMenuItems = [
    { to: "/", icon: <Home />, label: "Home" },
    { to: "/dashboard", icon: <BarChart4 />, label: "Dashboard" },
    { to: "/my-reviews", icon: <FileText />, label: "My Reviews" },
    { to: "/goals", icon: <Target />, label: "Goals" },
    { to: "/feedback", icon: <MessageSquareMore />, label: "Feedback" },
  ];

  // Select menu based on role
  let menuItems;
  switch (user.role) {
    case 'admin':
      menuItems = adminMenuItems;
      break;
    case 'manager':
      menuItems = managerMenuItems;
      break;
    default:
      menuItems = employeeMenuItems;
  }

  const handleRoleSwitch = (role: 'admin' | 'manager' | 'employee') => {
    switchRole(role);
    setRoleMenuOpen(false);
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          {sidebar.expanded ? (
            <h1 className="text-xl font-bold text-primary">PerformPath</h1>
          ) : (
            <div className="w-8 h-8 bg-primary text-white flex items-center justify-center rounded font-bold">
              P
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild data-active={location.pathname === item.to}>
                    <Link to={item.to}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {sidebar.expanded && (
          <SidebarGroup className="mt-auto">
            <div className="mb-4">
              <div className="text-xs text-muted-foreground">Quick Actions</div>
              <div className="mt-2 space-y-1">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Search className="mr-2 h-4 w-4" />
                  Quick Search
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Review
                </Button>
              </div>
            </div>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter className="border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DropdownMenu open={roleMenuOpen} onOpenChange={setRoleMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 p-0 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.profilePicture} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleRoleSwitch('admin')}>
                  <User className="mr-2 h-4 w-4" />
                  Switch to Admin
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleRoleSwitch('manager')}>
                  <User className="mr-2 h-4 w-4" />
                  Switch to Manager
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => handleRoleSwitch('employee')}>
                  <User className="mr-2 h-4 w-4" />
                  Switch to Employee
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {sidebar.expanded && (
              <div className="flex flex-col">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            )}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
