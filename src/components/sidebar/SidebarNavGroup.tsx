
import React from "react";
import { NavigationItem } from "@/components/sidebar/navigation-config";
import { Link } from "react-router-dom";

interface SidebarNavGroupProps {
  title: string;
  items: NavigationItem[];
}

export default function SidebarNavGroup({ title, items }: SidebarNavGroupProps) {
  if (items.length === 0) return null;
  
  return (
    <div className="px-3 py-2">
      <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-black/80">
        {title}
      </h2>
      <div className="space-y-1">
        {items.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className="flex items-center px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {item.icon && (
              <div className="mr-3 text-gray-700">
                {React.createElement(item.icon, { 
                  ...(({ size: 16 }) as React.SVGProps<SVGSVGElement>)
                })}
              </div>
            )}
            <span className="text-sm font-medium text-gray-700 hover:text-black">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
