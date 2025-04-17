
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { NavigationItem } from "./navigation-config";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface SidebarNavGroupProps {
  title: string;
  items: NavigationItem[];
}

export default function SidebarNavGroup({ title, items }: SidebarNavGroupProps) {
  const location = useLocation();
  
  if (items.length === 0) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarGroup className="mt-6">
      <SidebarGroupLabel className="px-6 text-gray-400 uppercase text-xs">
        {title}
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
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
  );
}
