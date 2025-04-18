
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { teamMembers, getTasksMockData } from "@/components/home/mockData";

import HomeHeader from "@/components/home/HomeHeader";
import MainContent from "@/components/home/MainContent";
import SearchDialog from "@/components/home/SearchDialog";

export default function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("tasks");
  const navigate = useNavigate();
  const tasks = getTasksMockData();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (user && !['manager', 'employee'].includes(user.role)) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!user) return null;

  const todoCount = 6;
  const performanceCount = 2;
  const recruitmentCount = 2;
  const hrCount = 2;

  return (
    <div className="flex flex-col h-full">
      <HomeHeader user={user} />

      <MainContent 
        tasks={tasks}
        teamMembers={teamMembers}
        todoCount={todoCount}
        performanceCount={performanceCount}
        recruitmentCount={recruitmentCount}
        hrCount={hrCount}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
