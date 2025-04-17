
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { NavigationItem } from "./navigation-config";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface SidebarNavGroupProps {
  title: string;
  items: NavigationItem[];
  className?: string;
}

export default function SidebarNavGroup({ title, items, className }: SidebarNavGroupProps) {
  const location = useLocation();
  const { expanded } = useSidebar();
  
  if (items.length === 0) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarGroup className={cn("mt-6", className)}>
      <SidebarGroupLabel className="px-6 text-gray-400 uppercase text-xs">
        {title}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.path}>
            <Link 
              to={item.path}
              className="flex items-center gap-3 w-full"
            >
              <SidebarMenuButton
                data-active={isActive(item.path)}
                className={cn(
                  "flex py-3 px-6 text-sm hover:bg-gray-800",
                  isActive(item.path) ? "bg-gray-800 text-white font-medium" : "text-gray-300"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

