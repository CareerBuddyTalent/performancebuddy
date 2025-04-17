
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Search, Bell, LayoutGrid } from "lucide-react";

// Import our refactored components
import NotificationCard from "@/components/home/NotificationCard";
import TaskCounters from "@/components/home/TaskCounters";
import TasksList from "@/components/home/TasksList";
import TeamMembersSection from "@/components/home/TeamMembersSection";
import FavoritesSection from "@/components/home/FavoritesSection";
import SearchDialog from "@/components/home/SearchDialog";

// Import mock data
import { 
  notifications, 
  teamMembers, 
  getTasksMockData, 
  favorites 
} from "@/components/home/mockData";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const tasks = getTasksMockData();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [layoutGridOpen, setLayoutGridOpen] = useState(false);

  // Role-based access control
  useEffect(() => {
    if (user && !['manager', 'employee'].includes(user.role)) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Task summary counts
  const todoCount = 6;
  const performanceCount = 2;
  const recruitmentCount = 2;
  const hrCount = 2;

  // Handle navigation to different sections
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Home</h1>
        <div className="flex items-center gap-4">
          <button 
            className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <button 
                className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-3 border-b">
                <h3 className="font-medium">Notifications</h3>
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
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{notification.description}</p>
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
              <button 
                className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Quick Access"
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
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

      {/* Main content with sidebar layout */}
      <div className="flex flex-col md:flex-row gap-6 h-full">
        {/* Main content area */}
        <div className="flex-1 space-y-6">
          {/* Notifications section */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {notifications.map((notification) => (
              <NotificationCard 
                key={notification.id} 
                notification={notification} 
              />
            ))}
          </div>

          {/* Task counts */}
          <TaskCounters 
            todoCount={todoCount}
            performanceCount={performanceCount}
            recruitmentCount={recruitmentCount}
            hrCount={hrCount}
          />

          {/* Tasks list */}
          <TasksList tasks={tasks} />
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 space-y-6">
          {/* Team members section */}
          <TeamMembersSection members={teamMembers} />

          {/* Favorites section */}
          <FavoritesSection favorites={favorites} />
        </div>
      </div>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
