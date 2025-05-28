
import React from "react";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import SidebarNavGroup from "@/components/sidebar/SidebarNavGroup";
import SidebarFooterContent from "@/components/sidebar/SidebarFooterContent";
import SidebarLogo from "@/components/sidebar/SidebarLogo";
import { navigationItems, getNavigationItemsByGroup } from "@/components/sidebar/navigation-config";

export default function AppSidebar() {
  const { user, logout } = useSupabaseAuth();
  
  if (!user) return null;
  
  const { mainNavItems, workNavItems, adminNavItems } = getNavigationItemsByGroup(
    navigationItems,
    user.role
  );

  return (
    <Sidebar className="border-none bg-white text-black">
      <SidebarContent className="p-0">
        <SidebarLogo />

        <SidebarNavGroup 
          title="Main" 
          items={mainNavItems} 
        />

        {workNavItems.length > 0 && (
          <SidebarNavGroup 
            title="Work" 
            items={workNavItems} 
          />
        )}

        {adminNavItems.length > 0 && (
          <SidebarNavGroup 
            title="Admin" 
            items={adminNavItems} 
          />
        )}
      </SidebarContent>
      
      <SidebarFooterContent 
        user={user}
        onLogout={logout}
      />
    </Sidebar>
  );
}
