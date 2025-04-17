
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Search, Bell } from "lucide-react";

// Import our refactored components
import NotificationCard from "@/components/home/NotificationCard";
import TaskCounters from "@/components/home/TaskCounters";
import TasksList from "@/components/home/TasksList";
import TeamMembersSection from "@/components/home/TeamMembersSection";
import FavoritesSection from "@/components/home/FavoritesSection";

// Import mock data
import { 
  notifications, 
  teamMembers, 
  getTasksMockData, 
  favorites 
} from "@/components/home/mockData";

export default function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const tasks = getTasksMockData();

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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Home</h1>
        <div className="flex items-center gap-4">
          <button className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
            <Search className="h-5 w-5" />
          </button>
          <button className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700">
            <Bell className="h-5 w-5" />
          </button>
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
    </div>
  );
}
