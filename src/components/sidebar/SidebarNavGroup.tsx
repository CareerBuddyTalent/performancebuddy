
import React from "react";
import { NavItem } from "@/components/sidebar/navigation-config";

interface SidebarNavGroupProps {
  title: string;
  items: NavItem[];
}

export default function SidebarNavGroup({ title, items }: SidebarNavGroupProps) {
  if (items.length === 0) return null;
  
  return (
    <div className="px-3 py-2">
      <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-white/80">
        {title}
      </h2>
      <div className="space-y-1">
        {items.map((item) => (
          <div key={item.href} className="flex items-center">
            {item.icon && (
              <item.icon className="mr-3 h-4 w-4 text-white/70" />
            )}
            <span className="text-sm font-medium text-white/70 hover:text-white">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
