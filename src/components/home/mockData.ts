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
    title: "Complete Self Review", 
    dueIn: "1 day", 
    type: "Performance", 
    assignee: { name: "You", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
    action: "Start Review",
    iconType: "FileText"
  },
  { 
    id: 2, 
    title: "Update Skills Assessment", 
    dueIn: "5 days", 
    type: "Development", 
    assignee: { name: "You", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
    action: "Update",
    iconType: "TrendingUp"
  },
  { 
    id: 3, 
    title: "Goal Progress Update", 
    dueIn: "11 days", 
    type: "Goals", 
    assignee: { name: "You", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
    action: "Update",
    iconType: "TrendingUp"
  },
  { 
    id: 4, 
    title: "Annual Leave Request (14 Sep - 18 Sep)", 
    dueIn: "25 days", 
    type: "Time Off", 
    assignee: { name: "You", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
    action: "Submit",
    iconType: "Clock"
  },
  { 
    id: 5, 
    title: "Upload Missing Documents", 
    dueIn: "35 days", 
    type: "Documents", 
    assignee: { name: "You", avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png" },
    action: "Upload",
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
    type: "person" as const
  },
  { 
    id: 2, 
    title: "Ruchir Gupta",
    subtitle: "Executive (Design)",
    avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png",
    type: "person" as const
  },
  { 
    id: 3, 
    title: "Poorva Gupta",
    subtitle: "Designer (Product)",
    avatar: "/lovable-uploads/eae3bd18-a4fb-4ca1-8ec2-cbf60f095332.png",
    type: "person" as const
  },
  { 
    id: 4, 
    title: "People Product",
    type: "dashboard" as const
  },
  { 
    id: 5, 
    title: "Product Owner",
    type: "dashboard" as const
  },
  { 
    id: 6, 
    title: "Monthly Active Users",
    subtitle: "People Product • Wade Wilson",
    type: "chart" as const
  },
  { 
    id: 7, 
    title: "Product NPS",
    subtitle: "People Product • Wade Wilson",
    type: "chart" as const
  },
  { 
    id: 8, 
    title: "eNPS",
    subtitle: "Talent • Alena Olga",
    type: "chart" as const
  }
];
