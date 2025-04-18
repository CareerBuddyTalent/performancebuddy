
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import NotificationPopover from "@/components/dashboard/NotificationPopover";
import { useAuth } from "@/context/AuthContext";

interface HomeHeaderProps {
  user: User;
  setSearchOpen: (open: boolean) => void;
}

export default function HomeHeader({
  user,
  setSearchOpen,
}: HomeHeaderProps) {
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
      </div>
    </div>
  );
}
