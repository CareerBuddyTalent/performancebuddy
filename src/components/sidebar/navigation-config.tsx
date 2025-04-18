
import { 
  LayoutDashboard, // More descriptive dashboard icon
  LineChart, // Better performance visualization
  Users2, // More modern people icon
  ClipboardCheck // Better surveys representation
} from "lucide-react";

// Define navigation item type
export interface NavigationItem {
  path: string;
  label: string;
  icon: React.ComponentType;
  roles: string[];
}

// Define the navigation items with role-based access
export const navigationItems: NavigationItem[] = [
  { 
    path: '/dashboard', 
    label: 'Dashboard', 
    icon: LayoutDashboard, 
    roles: ['admin', 'manager', 'employee'] 
  },
  { 
    path: '/performance', 
    label: 'Performance', 
    icon: LineChart, 
    roles: ['admin', 'manager', 'employee'] 
  },
  { 
    path: '/users', 
    label: 'People', 
    icon: Users2, 
    roles: ['admin', 'manager'] 
  },
  { 
    path: '/surveys', 
    label: 'Surveys', 
    icon: ClipboardCheck, 
    roles: ['admin', 'manager', 'employee'] 
  },
];

// Helper function to get navigation items by group
export const getNavigationItemsByGroup = (items: NavigationItem[], userRole: string) => {
  // Filter navigation items based on user role
  const filteredNavItems = items.filter(item => 
    item.roles.includes(userRole)
  );
  
  return {
    mainNavItems: filteredNavItems.filter(item => 
      ['/dashboard', '/performance', '/users', '/surveys'].includes(item.path)
    ),
    
    workNavItems: [],
    
    adminNavItems: filteredNavItems.filter(item => 
      ['/companies'].includes(item.path)
    )
  };
};
