
import React from "react";
import { NavigationItem } from "@/components/sidebar/navigation-config";

interface SidebarNavGroupProps {
  title: string;
  items: NavigationItem[];
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
          <div key={item.path} className="flex items-center">
            {item.icon && (
              <div className="mr-3 text-white/70">
                <item.icon size={16} />
              </div>
            )}
            <span className="text-sm font-medium text-white/70 hover:text-white">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
