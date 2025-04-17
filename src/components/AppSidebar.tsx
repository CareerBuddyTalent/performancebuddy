
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  Home, User, Users, Briefcase, BarChart, Building2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Define the navigation items with role-based access
const navigationItems = [
  { path: '/home', label: 'Home', icon: Home, roles: ['admin', 'manager', 'employee'] },
  { path: '/my-profile', label: 'My Profile', icon: User, roles: ['admin', 'manager', 'employee'] },
  { path: '/users', label: 'People', icon: Users, roles: ['admin', 'manager'] }, // Removed employee access
  { path: '/recruitment', label: 'Recruitment', icon: Briefcase, roles: ['admin', 'manager'] },
  { path: '/performance', label: 'Performance', icon: BarChart, roles: ['admin', 'manager'] },
  { path: '/companies', label: 'Organisation', icon: Building2, roles: ['admin'] },
];

export default function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;
  
  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter(item => 
    item.roles.includes(user.role)
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

        <SidebarMenu>
          {filteredNavItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                className="flex py-4 px-6 text-sm hover:bg-gray-800"
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
      </SidebarContent>
    </Sidebar>
  );
}
