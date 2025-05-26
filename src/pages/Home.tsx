
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import HomeHeader from "@/components/home/HomeHeader";
import MainContent from "@/components/home/MainContent";
import FavoritesSection from "@/components/home/FavoritesSection";
import { useRealDashboardData } from "@/hooks/useRealDashboardData";
import { useRealPerformanceData } from "@/hooks/useRealPerformanceData";
import { Card } from "@/components/ui/card";

export default function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("tasks");
  
  const { tasks, stats, isLoading: dashboardLoading } = useRealDashboardData();
  const { teamMembers, isLoading: teamLoading } = useRealPerformanceData();

  // Mock favorites data (can be replaced with real data later)
  const favorites = [
    { id: 1, title: "Annual Performance Review", subtitle: "Due in 3 days", type: "dashboard" as const },
    { id: 2, title: "Team Goals Dashboard", subtitle: "Q4 2024", type: "chart" as const },
    { id: 3, title: "Sarah Johnson", subtitle: "Direct Report", type: "person" as const, avatar: "/placeholder.svg" },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Please log in to continue.</div>
      </div>
    );
  }

  if (dashboardLoading || teamLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-muted-foreground">Loading dashboard...</div>
        </div>
      </Card>
    );
  }

  // Transform tasks for display
  const displayTasks = tasks.map(task => ({
    id: parseInt(task.id.split('-')[1]) || Math.random(),
    title: task.title,
    description: task.description,
    type: task.type,
    priority: task.priority,
    dueIn: task.due_date ? 
      `${Math.ceil((new Date(task.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days` : 
      "No due date",
    dueDate: task.due_date || new Date().toISOString(),
    project: task.type === 'goal' ? 'Goals' : task.type === 'review' ? 'Reviews' : 'Tasks'
  }));

  // Transform team members for display
  const displayTeamMembers = teamMembers.map((member, index) => ({
    id: index + 1,
    name: member.name,
    avatar: member.profile_picture || "/placeholder.svg"
  }));

  return (
    <div className="space-y-6">
      <HomeHeader user={user} />
      
      <div className="flex flex-col lg:flex-row gap-6">
        <MainContent
          tasks={displayTasks}
          teamMembers={displayTeamMembers}
          todoCount={stats.totalGoals - stats.completedGoals}
          performanceCount={stats.pendingReviews}
          recruitmentCount={0}
          hrCount={stats.teamSize}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        <div className="w-full lg:w-80">
          <FavoritesSection favorites={favorites} />
        </div>
      </div>
    </div>
  );
}
