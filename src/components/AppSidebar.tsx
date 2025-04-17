
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

export default function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

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
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="flex py-4 px-6 text-sm hover:bg-gray-800"
              data-active={isActive('/home')}
            >
              <Link to="/home" className="flex items-center gap-3">
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="flex py-4 px-6 text-sm hover:bg-gray-800"
              data-active={isActive('/my-profile')}
            >
              <Link to="/my-profile" className="flex items-center gap-3">
                <User className="h-5 w-5" />
                <span>My profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="flex py-4 px-6 text-sm hover:bg-gray-800"
              data-active={isActive('/people')}
            >
              <Link to="/users" className="flex items-center gap-3">
                <Users className="h-5 w-5" />
                <span>People</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="flex py-4 px-6 text-sm hover:bg-gray-800"
              data-active={isActive('/recruitment')}
            >
              <Link to="/recruitment" className="flex items-center gap-3">
                <Briefcase className="h-5 w-5" />
                <span>Recruitment</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="flex py-4 px-6 text-sm hover:bg-gray-800"
              data-active={isActive('/performance')}
            >
              <Link to="/performance" className="flex items-center gap-3">
                <BarChart className="h-5 w-5" />
                <span>Performance</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="flex py-4 px-6 text-sm hover:bg-gray-800"
              data-active={isActive('/organisation')}
            >
              <Link to="/companies" className="flex items-center gap-3">
                <Building2 className="h-5 w-5" />
                <span>Organisation</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
