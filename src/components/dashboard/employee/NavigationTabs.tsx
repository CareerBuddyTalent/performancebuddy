import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { UserCircle, BarChart2, Target, ChartPie } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface NavigationTabsProps {
  goalProgress: number;
}

export default function NavigationTabs({ goalProgress }: NavigationTabsProps) {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  const canAccessPerformance = user && (user.role === 'admin' || user.role === 'manager');

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and actions</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Link to="/self-review" className="flex items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
            <Star className="h-5 w-5 mr-3 text-primary" />
            <div>
              <h3 className="font-medium">Self Review</h3>
              <p className="text-sm text-muted-foreground">Complete your performance self-assessment</p>
            </div>
          </Link>
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
          
          {canAccessPerformance && (
            <Button 
              variant={isActive('/performance') ? "default" : "ghost"} 
              className={`flex items-center whitespace-nowrap rounded-full ${
                isActive('/performance') 
                  ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white" 
                  : "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
              }`}
              asChild
            >
              <Link to="/performance">
                <ChartPie className="mr-2 h-4 w-4" />
                Analytics
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
