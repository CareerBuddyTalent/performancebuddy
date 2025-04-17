
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { UserCircle, BarChart2, Target, FileText } from "lucide-react";

interface NavigationTabsProps {
  goalProgress: number;
}

export default function NavigationTabs({ goalProgress }: NavigationTabsProps) {
  return (
    <div className="flex overflow-x-auto pb-2 gap-2">
      <Button 
        variant="ghost" 
        className="flex items-center whitespace-nowrap rounded-full"
        asChild
      >
        <Link to="/user/profile">
          <UserCircle className="mr-2 h-4 w-4" />
          Profile
        </Link>
      </Button>
      
      <Button 
        variant="ghost" 
        className="flex items-center whitespace-nowrap rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300"
        asChild
      >
        <Link to="/dashboard">
          <BarChart2 className="mr-2 h-4 w-4" />
          Performance
        </Link>
      </Button>
      
      <Button 
        variant="ghost" 
        className="flex items-center whitespace-nowrap rounded-full"
        asChild
      >
        <Link to="/goals">
          <Target className="mr-2 h-4 w-4" />
          Goals • {goalProgress}%
        </Link>
      </Button>
      
      <Button 
        variant="ghost" 
        className="flex items-center whitespace-nowrap rounded-full"
        asChild
      >
        <Link to="/feedback">
          <FileText className="mr-2 h-4 w-4" />
          Roadmap
        </Link>
      </Button>
    </div>
  );
}
