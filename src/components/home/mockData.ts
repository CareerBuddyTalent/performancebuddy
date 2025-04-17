
import { ReactNode } from "react";

// Mock data for notifications
export const notifications = [
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
export const teamMembers = [
  { id: 1, name: "John Smith", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
  { id: 2, name: "Poorva Gupta", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
  { id: 3, name: "Courtney Henry", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
  { id: 4, name: "Alena Olga", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
  { id: 5, name: "Ruchir Gupta", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" }
];

// Mock data for tasks
export const getTasksMockData = () => [
  { 
    id: 1, 
    title: "Review for Jane Doe", 
    dueIn: "1 day", 
    type: "Performance", 
    assignee: { name: "Jane Doe", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
    action: "Review",
    iconType: "FileText"
  },
  { 
    id: 2, 
    title: "Pending feedback for 'Screen Call' interview", 
    dueIn: "5 days", 
    type: "Interview", 
    assignee: { name: "Franco Delort", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
    action: "Add feedback",
    iconType: "MessageSquare"
  },
  { 
    id: 3, 
    title: "KPI · Monthly revenue ($m)", 
    dueIn: "11 days", 
    type: "Performance", 
    assignee: { name: "Ronald Edgar", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png", initial: "RE" },
    action: "Take action",
    iconType: "TrendingUp"
  },
  { 
    id: 4, 
    title: "(14 Sep - 18 Sep) Annual Leave", 
    dueIn: "25 days", 
    type: "Time Off", 
    assignee: { name: "Ruchir Gupta", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
    action: "Approve",
    iconType: "Clock"
  },
  { 
    id: 5, 
    title: "Requisition · Accountant", 
    dueIn: "35 days", 
    type: "Recruitment", 
    assignee: { name: "Jane Doe", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
    action: "Approve",
    iconType: "UserPlus"
  },
  { 
    id: 6, 
    title: "Pending Upload: Passport", 
    dueIn: "35 days", 
    type: "Documents", 
    assignee: { name: "Wade Wilson", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
    action: "Take action",
    iconType: "FileCheck"
  }
];

// Mock data for favorites/dashboard items
export const favorites = [
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
