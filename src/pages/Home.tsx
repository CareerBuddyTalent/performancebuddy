import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCompany } from "@/context/CompanyContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Search, Bell, MoreHorizontal, Home as HomeIcon, 
  User, Users, Briefcase, BarChart, Building2, 
  ChevronDown, ChevronRight, X, Edit, FileText,
  MessageSquare, TrendingUp, Clock, FileCheck, UserPlus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock data for notifications
const notifications = [
  {
    id: 1,
    title: "RevBets",
    description: "Submit New Bet Idea to the RevBets service desk. We are happy to hear you out and help with further scoping",
    days: 12,
    sender: {
      name: "Ruchir Gupta",
      avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png"
    },
    image: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png"
  },
  {
    id: 2,
    title: "9th Anniversary!",
    description: "Are you ready for the biggest party of the year? Find exact dates here.",
    days: 12,
    sender: {
      name: "Alena Olga",
      avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png"
    },
    image: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png"
  }
];

// Mock data for team members
const teamMembers = [
  { id: 1, name: "John Smith", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
  { id: 2, name: "Poorva Gupta", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
  { id: 3, name: "Courtney Henry", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
  { id: 4, name: "Alena Olga", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
  { id: 5, name: "Ruchir Gupta", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" }
];

// Mock data for tasks
const tasks = [
  { 
    id: 1, 
    title: "Review for Jane Doe", 
    dueIn: "1 day", 
    type: "Performance", 
    assignee: { name: "Jane Doe", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
    action: "Review",
    icon: <FileText className="h-5 w-5 text-white" />
  },
  { 
    id: 2, 
    title: "Pending feedback for 'Screen Call' interview", 
    dueIn: "5 days", 
    type: "Interview", 
    assignee: { name: "Franco Delort", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
    action: "Add feedback",
    icon: <MessageSquare className="h-5 w-5 text-white" />
  },
  { 
    id: 3, 
    title: "KPI · Monthly revenue ($m)", 
    dueIn: "11 days", 
    type: "Performance", 
    assignee: { name: "Ronald Edgar", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png", initial: "RE" },
    action: "Take action",
    icon: <TrendingUp className="h-5 w-5 text-white" />
  },
  { 
    id: 4, 
    title: "(14 Sep - 18 Sep) Annual Leave", 
    dueIn: "25 days", 
    type: "Time Off", 
    assignee: { name: "Ruchir Gupta", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
    action: "Approve",
    icon: <Clock className="h-5 w-5 text-white" />
  },
  { 
    id: 5, 
    title: "Requisition · Accountant", 
    dueIn: "35 days", 
    type: "Recruitment", 
    assignee: { name: "Jane Doe", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
    action: "Approve",
    icon: <UserPlus className="h-5 w-5 text-white" />
  },
  { 
    id: 6, 
    title: "Pending Upload: Passport", 
    dueIn: "35 days", 
    type: "Documents", 
    assignee: { name: "Wade Wilson", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
    action: "Take action",
    icon: <FileCheck className="h-5 w-5 text-white" />
  }
];

// Mock data for favorites/dashboard items
const favorites = [
  { 
    id: 1, 
    title: "Jane Doe",
    subtitle: "Designer (Product)",
    avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png",
    type: "person"
  },
  { 
    id: 2, 
    title: "Ruchir Gupta",
    subtitle: "Executive (Design)",
    avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png",
    type: "person"
  },
  { 
    id: 3, 
    title: "Poorva Gupta",
    subtitle: "Designer (Product)",
    avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png",
    type: "person"
  },
  { 
    id: 4, 
    title: "People Product",
    type: "dashboard"
  },
  { 
    id: 5, 
    title: "Product Owner",
    type: "dashboard"
  },
  { 
    id: 6, 
    title: "Monthly Active Users",
    subtitle: "People Product • Wade Wilson",
    type: "chart"
  },
  { 
    id: 7, 
    title: "Product NPS",
    subtitle: "People Product • Wade Wilson",
    type: "chart"
  },
  { 
    id: 8, 
    title: "eNPS",
    subtitle: "Talent • Alena Olga",
    type: "chart"
  }
];

export default function Home() {
  const { user } = useAuth();
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

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
              <div 
                key={notification.id}
                className="min-w-[400px] max-w-md rounded-lg bg-primary/10 p-4 relative"
              >
                <button className="absolute right-2 top-2 rounded-full p-1 hover:bg-gray-200/20">
                  <X className="h-4 w-4" />
                </button>
                <div className="flex gap-3 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={notification.sender.avatar} alt={notification.sender.name} />
                    <AvatarFallback>{notification.sender.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{notification.sender.name}</div>
                </div>
                <h3 className="text-lg font-semibold mb-1">{notification.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {notification.description}
                </p>
                <div className="text-xs text-gray-500">{notification.days} days ago</div>
              </div>
            ))}
          </div>

          {/* Task counts */}
          <div className="flex space-x-4 overflow-x-auto">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
              <span className="text-xl font-bold">{todoCount}</span>
              <span className="text-sm">To do's</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
              <span className="text-xl font-bold">{performanceCount}</span>
              <span className="text-sm">Performance</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
              <span className="text-xl font-bold">{recruitmentCount}</span>
              <span className="text-sm">Recruitment</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
              <span className="text-xl font-bold">{hrCount}</span>
              <span className="text-sm">HR</span>
            </div>
          </div>

          {/* Tasks list */}
          <div className="space-y-px">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    {task.icon}
                  </div>
                  <div>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-red-500">Due in {task.dueIn}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-gray-200 dark:bg-gray-700 text-xs font-normal">
                    {task.type}
                  </Badge>
                  <div className="flex items-center gap-2">
                    {task.assignee.initial ? (
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                        {task.assignee.initial}
                      </div>
                    ) : (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                        <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <span className="text-sm">{task.assignee.name}</span>
                  </div>
                  <Button variant="secondary" size="sm" className="rounded-full">
                    {task.action}
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-full px-2">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 space-y-6">
          {/* Team members section */}
          <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1">
                <span className="font-medium">In your team</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <Link to="/users" className="text-primary text-sm">See all</Link>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex flex-col items-center gap-1">
                  <Avatar className="h-14 w-14 border-2 border-primary rounded-full">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium text-center max-w-24 truncate">{member.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Favorites section */}
          <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Favourites</span>
              <Button variant="ghost" size="sm" className="p-1">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {favorites.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  {item.type === "person" && (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={item.avatar} alt={item.title} />
                      <AvatarFallback>{item.title.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  {item.type === "dashboard" && (
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500">
                      <Users className="h-5 w-5" />
                    </div>
                  )}
                  {item.type === "chart" && (
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-500">
                      <BarChart className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{item.title}</div>
                    {item.subtitle && (
                      <div className="text-xs text-gray-500">{item.subtitle}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
