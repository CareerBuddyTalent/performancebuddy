
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Search, LayoutGrid } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import NotificationPopover from "@/components/dashboard/NotificationPopover";

interface HomeHeaderProps {
  user: User;
  layoutGridOpen: boolean;
  setLayoutGridOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
}

export default function HomeHeader({
  user,
  layoutGridOpen,
  setLayoutGridOpen,
  setSearchOpen,
}: HomeHeaderProps) {
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Performance', path: '/performance' },
    { label: 'Goals', path: '/goals' },
    { label: 'Feedback', path: '/feedback' },
    { label: 'Team Members', path: '/users' },
    { label: 'Calendar', path: '/calendar' },
  ];

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome, {user.name}</h1>
        <p className="text-muted-foreground">Here's what's happening in your workspace today</p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full"
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Button>
        
        <NotificationPopover />

        <DropdownMenu open={layoutGridOpen} onOpenChange={setLayoutGridOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full"
              aria-label="Quick Access"
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {menuItems.map((item) => (
              <DropdownMenuItem key={item.path} onClick={() => navigate(item.path)}>
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
