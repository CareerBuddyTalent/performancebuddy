
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { UserCircle2, ChartBar, Target, Star } from "lucide-react";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface NavigationTabsProps {
  goalProgress: number;
}

export default function NavigationTabs({ goalProgress }: NavigationTabsProps) {
  const location = useLocation();
  const { user } = useSupabaseAuth();
  
  const isActive = (path: string) => location.pathname === path;
  const canAccessPerformance = user && (user.role === 'admin' || user.role === 'manager');

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently accessed features</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Link to="/self-review" className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors">
              <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-purple-900 dark:text-purple-100">Self Review</h3>
              <p className="text-sm text-purple-600/80 dark:text-purple-300/80">Complete your performance self-assessment</p>
            </div>
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button 
              variant={isActive('/my-profile') ? "default" : "outline"} 
              className={`flex items-center justify-start h-auto py-4 px-4 gap-3 ${
                isActive('/my-profile') 
                  ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600"
                  : "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20"
              }`}
              asChild
            >
              <Link to="/my-profile">
                <UserCircle2 className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Profile</div>
                  <div className="text-xs opacity-90">View your info</div>
                </div>
              </Link>
            </Button>
            
            <Button 
              variant={isActive('/performance') ? "default" : "outline"} 
              className={`flex items-center justify-start h-auto py-4 px-4 gap-3 ${
                isActive('/performance')
                  ? "bg-green-600 text-white hover:bg-green-700 dark:bg-green-600"
                  : "hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20"
              }`}
              asChild
            >
              <Link to="/performance">
                <ChartBar className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Performance</div>
                  <div className="text-xs opacity-90">Track progress</div>
                </div>
              </Link>
            </Button>
            
            <Button 
              variant={isActive('/goals') ? "default" : "outline"} 
              className={`flex items-center justify-start h-auto py-4 px-4 gap-3 ${
                isActive('/goals')
                  ? "bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-600"
                  : "hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-orange-900/20"
              }`}
              asChild
            >
              <Link to="/goals">
                <Target className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Goals</div>
                  <div className="text-xs opacity-90">{goalProgress}% complete</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
