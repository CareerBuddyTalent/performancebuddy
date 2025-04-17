
import React from 'react';
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarFooter } from "@/components/ui/sidebar";

interface SidebarFooterContentProps {
  user: {
    name: string;
    role: string;
    profilePicture?: string;
  };
  onLogout: () => void;
}

export default function SidebarFooterContent({ user, onLogout }: SidebarFooterContentProps) {
  return (
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
        onClick={onLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign out
      </Button>
    </SidebarFooter>
  );
}
