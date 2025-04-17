
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Search, Bell, LayoutGrid } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

interface HomeHeaderProps {
  user: User;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  layoutGridOpen: boolean;
  setLayoutGridOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  notifications: any[];
}

export default function HomeHeader({
  user,
  notificationsOpen,
  setNotificationsOpen,
  layoutGridOpen,
  setLayoutGridOpen,
  setSearchOpen,
  notifications
}: HomeHeaderProps) {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

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
        
        <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="rounded-full relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-3 border-b flex justify-between items-center">
              <h3 className="font-medium">Notifications</h3>
              <Button variant="ghost" size="sm" className="h-8 text-xs">Mark all as read</Button>
            </div>
            <div className="max-h-96 overflow-auto">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="p-3 border-b hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => setNotificationsOpen(false)}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={notification.sender.avatar} 
                        alt={notification.sender.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {notification.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{notification.days} days ago</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2 text-center border-t">
              <button 
                className="text-sm text-blue-600 hover:underline"
                onClick={() => handleNavigate('/notifications')}
              >
                View all notifications
              </button>
            </div>
          </PopoverContent>
        </Popover>

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
            <DropdownMenuItem onClick={() => handleNavigate('/dashboard')}>
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigate('/performance')}>
              Performance
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigate('/goals')}>
              Goals
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigate('/feedback')}>
              Feedback
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigate('/users')}>
              Team Members
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigate('/calendar')}>
              Calendar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
