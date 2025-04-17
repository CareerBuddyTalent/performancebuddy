
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  Home, User, Users, Briefcase, BarChart, Building2, 
  LogOut, Settings, HelpCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

// Define the navigation items with role-based access
const navigationItems = [
  { path: '/home', label: 'Home', icon: Home, roles: ['admin', 'manager', 'employee'] },
  { path: '/my-profile', label: 'My Profile', icon: User, roles: ['admin', 'manager', 'employee'] },
  { path: '/users', label: 'People', icon: Users, roles: ['admin', 'manager'] },
  { path: '/recruitment', label: 'Recruitment', icon: Briefcase, roles: ['admin', 'manager'] },
  { path: '/performance', label: 'Performance', icon: BarChart, roles: ['admin', 'manager'] },
  { path: '/companies', label: 'Organisation', icon: Building2, roles: ['admin'] },
];

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;
  
  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter(item => 
    item.roles.includes(user.role)
  );

  // Group navigation items
  const mainNavItems = filteredNavItems.filter(item => 
    ['/home', '/my-profile', '/users'].includes(item.path)
  );
  
  const workNavItems = filteredNavItems.filter(item => 
    ['/recruitment', '/performance'].includes(item.path)
  );
  
  const adminNavItems = filteredNavItems.filter(item => 
    ['/companies'].includes(item.path)
  );

  return (
    <Sidebar className="border-none bg-[#111827] text-white">
      <SidebarContent className="p-0">
        <div className="p-4 pb-0">
          <Link to="/" className="flex items-center mb-6">
            <div className="h-10 w-10 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
              R
            </div>
          </Link>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-gray-400 uppercase text-xs">
            Main
          </SidebarGroupLabel>
          <SidebarMenu>
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  className={`flex py-3 px-6 text-sm hover:bg-gray-800 ${
                    isActive(item.path) ? "bg-gray-800 text-white font-medium" : "text-gray-300"
                  }`}
                  data-active={isActive(item.path)}
                >
                  <Link to={item.path} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {workNavItems.length > 0 && (
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="px-6 text-gray-400 uppercase text-xs">
              Work
            </SidebarGroupLabel>
            <SidebarMenu>
              {workNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    className={`flex py-3 px-6 text-sm hover:bg-gray-800 ${
                      isActive(item.path) ? "bg-gray-800 text-white font-medium" : "text-gray-300"
                    }`}
                    data-active={isActive(item.path)}
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}

        {adminNavItems.length > 0 && (
          <SidebarGroup className="mt-6">
            <SidebarGroupLabel className="px-6 text-gray-400 uppercase text-xs">
              Admin
            </SidebarGroupLabel>
            <SidebarMenu>
              {adminNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    className={`flex py-3 px-6 text-sm hover:bg-gray-800 ${
                      isActive(item.path) ? "bg-gray-800 text-white font-medium" : "text-gray-300"
                    }`}
                    data-active={isActive(item.path)}
                  >
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter className="mt-auto border-t border-gray-700 p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profilePicture} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user.role}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
          onClick={() => logout()}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
