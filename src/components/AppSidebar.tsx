
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Target,
  MessageSquare,
  BarChart2,
  GraduationCap,
  FileQuestion,
  Users,
  ClipboardList,
  CalendarDays
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function AppSidebar({ className }: SidebarProps) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { expanded } = useSidebar();
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const isCollapsed = !expanded;

  return (
    <div className={cn("flex flex-col h-screen border-r", className)}>
      <ScrollArea className="flex-1">
        <div className={cn("flex flex-col gap-1 p-2", isCollapsed ? "items-center" : "")}>
          <Button
            variant={pathname === "/dashboard" ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "w-full justify-start",
              isCollapsed ? "justify-center" : ""
            )}
            asChild
          >
            <Link to="/dashboard">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </Button>
          
          <Button
            variant={pathname === "/goals" ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "w-full justify-start",
              isCollapsed ? "justify-center" : ""
            )}
            asChild
          >
            <Link to="/goals">
              <Target className="h-4 w-4 mr-2" />
              {!isCollapsed && <span>Goals</span>}
            </Link>
          </Button>
          
          <Button
            variant={pathname === "/feedback" ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "w-full justify-start",
              isCollapsed ? "justify-center" : ""
            )}
            asChild
          >
            <Link to="/feedback">
              <MessageSquare className="h-4 w-4 mr-2" />
              {!isCollapsed && <span>Feedback</span>}
            </Link>
          </Button>
          
          <Button
            variant={pathname === "/skills" ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "w-full justify-start",
              isCollapsed ? "justify-center" : ""
            )}
            asChild
          >
            <Link to="/skills">
              <GraduationCap className="h-4 w-4 mr-2" />
              {!isCollapsed && <span>Skills</span>}
            </Link>
          </Button>
          
          <Button
            variant={pathname === "/surveys" ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "w-full justify-start",
              isCollapsed ? "justify-center" : ""
            )}
            asChild
          >
            <Link to="/surveys">
              <FileQuestion className="h-4 w-4 mr-2" />
              {!isCollapsed && <span>Surveys</span>}
            </Link>
          </Button>
          
          {(isAdmin || isManager) && (
            <Button
              variant={pathname === "/reviews" ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "w-full justify-start",
                isCollapsed ? "justify-center" : ""
              )}
              asChild
            >
              <Link to="/reviews">
                <ClipboardList className="h-4 w-4 mr-2" />
                {!isCollapsed && <span>Reviews</span>}
              </Link>
            </Button>
          )}
          
          {(isAdmin || isManager) && (
            <Button
              variant={pathname === "/cycles" ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "w-full justify-start",
                isCollapsed ? "justify-center" : ""
              )}
              asChild
            >
              <Link to="/cycles">
                <CalendarDays className="h-4 w-4 mr-2" />
                {!isCollapsed && <span>Cycles</span>}
              </Link>
            </Button>
          )}
          
          {(isAdmin || isManager) && (
            <Button
              variant={pathname === "/users" ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "w-full justify-start",
                isCollapsed ? "justify-center" : ""
              )}
              asChild
            >
              <Link to="/users">
                <Users className="h-4 w-4 mr-2" />
                {!isCollapsed && <span>Users</span>}
              </Link>
            </Button>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
