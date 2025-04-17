
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { UserCircle, BarChart2, Target } from "lucide-react";

interface NavigationTabsProps {
  goalProgress: number;
}

export default function NavigationTabs({ goalProgress }: NavigationTabsProps) {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex overflow-x-auto pb-2 gap-2">
      <Button 
        variant={isActive('/my-profile') ? "default" : "ghost"} 
        className={`flex items-center whitespace-nowrap rounded-full ${
          isActive('/my-profile') 
            ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white" 
            : "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
        }`}
        asChild
      >
        <Link to="/my-profile">
          <UserCircle className="mr-2 h-4 w-4" />
          Profile
        </Link>
      </Button>
      
      <Button 
        variant={isActive('/dashboard') ? "default" : "ghost"} 
        className={`flex items-center whitespace-nowrap rounded-full ${
          isActive('/dashboard') 
            ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white" 
            : "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
        }`}
        asChild
      >
        <Link to="/dashboard">
          <BarChart2 className="mr-2 h-4 w-4" />
          Performance
        </Link>
      </Button>
      
      <Button 
        variant={isActive('/goals') ? "default" : "ghost"} 
        className={`flex items-center whitespace-nowrap rounded-full ${
          isActive('/goals') 
            ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white" 
            : "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
        }`}
        asChild
      >
        <Link to="/goals">
          <Target className="mr-2 h-4 w-4" />
          Goals • {goalProgress}%
        </Link>
      </Button>
    </div>
  );
}
