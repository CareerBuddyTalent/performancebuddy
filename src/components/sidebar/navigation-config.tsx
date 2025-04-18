
import { 
  BarChart, Building2, ClipboardList
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
  { path: '/dashboard', label: 'Dashboard', icon: BarChart, roles: ['admin', 'manager', 'employee'] },
  { path: '/performance', label: 'Performance', icon: BarChart, roles: ['admin', 'manager', 'employee'] },
  { path: '/users', label: 'People', icon: ClipboardList, roles: ['admin', 'manager'] },
  { path: '/companies', label: 'Organisation', icon: Building2, roles: ['admin'] },
  { path: '/surveys', label: 'Surveys', icon: ClipboardList, roles: ['admin', 'manager', 'employee'] },
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
