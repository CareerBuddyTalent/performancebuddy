import { useState } from "react";
import { Goal } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";
import PerformanceHeader from "./dashboard/PerformanceHeader";
import PerformanceStats from "./dashboard/PerformanceStats";
import PerformanceTabs from "./PerformanceTabs";
import GoalManagement from "./dashboard/GoalManagement";

// Initial mock performance goals data
const initialGoals: Goal[] = [
  {
    id: "1",
    userId: "user1",
    title: "Dream Team",
    description: "Build a high-performing team",
    dueDate: new Date(2024, 11, 31),
    status: "in_progress",
    progress: 71,
    createdAt: new Date(),
    updatedAt: new Date(),
    level: "company",
    metrics: [
      { name: "Team members", target: 75000, current: 53250, unit: "£" }
    ]
  },
  {
    id: "2",
    userId: "user1",
    title: "Fast Growth",
    description: "Achieve rapid growth targets",
    dueDate: new Date(2024, 11, 31),
    status: "in_progress",
    progress: 31,
    createdAt: new Date(),
    updatedAt: new Date(),
    level: "company",
    metrics: [
      { name: "New users", target: 75, current: 23, unit: "people" }
    ]
  },
  {
    id: "3",
    userId: "user1",
    title: "Profitability",
    description: "Increase profit margins",
    dueDate: new Date(2024, 11, 31),
    status: "in_progress",
    progress: 75,
    createdAt: new Date(),
    updatedAt: new Date(),
    level: "company",
    metrics: [
      { name: "Profit margin", target: 23, current: 19, unit: "%" }
    ]
  },
  {
    id: "4",
    userId: "user1",
    title: "Deliver WOW",
    description: "Exceed customer expectations",
    dueDate: new Date(2024, 11, 31),
    status: "not_started",
    progress: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
    level: "company",
    metrics: [
      { name: "Delivery time", target: 5, current: 9, unit: "Days" }
    ]
  },
  {
    id: "5",
    userId: "user1",
    title: "Customer Service",
    description: "Improve customer satisfaction",
    dueDate: new Date(2024, 11, 31),
    status: "in_progress",
    progress: 54,
    createdAt: new Date(),
    updatedAt: new Date(),
    level: "company",
    metrics: [
      { name: "Satisfaction score", target: 100, current: 77, unit: "%" }
    ]
  }
];

export default function PerformanceDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("goals");
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('quarter');
  const [performanceGoals, setPerformanceGoals] = useState<Goal[]>(initialGoals);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  
  const isAdmin = user?.role === 'admin';

  const handleAddGoal = () => {
    setIsAddGoalOpen(true);
  };

  const handleExport = (format: string) => {
    toast({
      title: `Exporting ${timeframe}ly report`,
      description: `Your ${timeframe}ly performance report is being generated as ${format.toUpperCase()}`,
    });
  };

  const handleAddGoalSubmit = (goal: Goal) => {
    const newGoal = {
      ...goal,
      id: uuidv4(),
      userId: user?.id || 'user1',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setPerformanceGoals(prev => [...prev, newGoal]);
  };

  const handleUpdateGoal = (updatedGoal: Goal) => {
    setPerformanceGoals(prev => 
      prev.map(goal => goal.id === updatedGoal.id ? { ...updatedGoal, updatedAt: new Date() } : goal)
    );
  };

  const handleDeleteGoal = (goalId: string) => {
    setPerformanceGoals(prev => prev.filter(goal => goal.id !== goalId));
    toast({
      title: "Goal deleted",
      description: "The goal has been removed successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <PerformanceHeader onAddGoal={handleAddGoal} />
      <PerformanceStats performanceGoals={performanceGoals} />
      
      <PerformanceTabs 
        isAdmin={isAdmin} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        performanceGoals={performanceGoals} 
        timeframe={timeframe}
        handleExport={handleExport}
        onAddGoal={handleAddGoalSubmit}
        onUpdateGoal={handleUpdateGoal}
        onDeleteGoal={handleDeleteGoal}
      />

      <GoalManagement
        onAddGoal={handleAddGoalSubmit}
        onUpdateGoal={handleUpdateGoal}
        isAddGoalOpen={isAddGoalOpen}
        setIsAddGoalOpen={setIsAddGoalOpen}
      />
    </div>
  );
}
