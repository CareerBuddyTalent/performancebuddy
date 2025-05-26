
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useClerkAuth } from "@/context/ClerkAuthContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

export default function UserMenuDropdown() {
  const navigate = useNavigate();
  const { user, logout } = useClerkAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  if (!user) return null;
  
  const handleNavigate = (path: string) => {
    navigate(path);
    setUserMenuOpen(false);
  };

  return (
    <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-primary/10 transition-all hover:ring-4">
          <AvatarImage src={user.profilePicture} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2">
        <DropdownMenuItem 
          onClick={() => handleNavigate('/my-profile')} 
          className="cursor-pointer flex items-center gap-2 py-2 focus:bg-accent"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profilePicture} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleNavigate('/settings')} className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-red-500 focus:text-red-500">
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
