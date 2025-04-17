
import { 
  Home, User, Users, Briefcase, BarChart, Building2
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
  { path: '/home', label: 'Home', icon: Home, roles: ['admin', 'manager', 'employee'] },
  { path: '/my-profile', label: 'My Profile', icon: User, roles: ['admin', 'manager', 'employee'] },
  { path: '/users', label: 'People', icon: Users, roles: ['admin', 'manager'] },
  { path: '/recruitment', label: 'Recruitment', icon: Briefcase, roles: ['manager'] },
  { path: '/performance', label: 'Performance', icon: BarChart, roles: ['admin', 'manager'] },
  { path: '/companies', label: 'Organisation', icon: Building2, roles: ['admin'] },
];

// Helper function to get navigation items by group
export const getNavigationItemsByGroup = (items: NavigationItem[], userRole: string) => {
  // Filter navigation items based on user role
  const filteredNavItems = items.filter(item => 
    item.roles.includes(userRole)
  );
  
  // Group navigation items
  return {
    mainNavItems: filteredNavItems.filter(item => 
      ['/home', '/my-profile', '/users'].includes(item.path)
    ),
    
    workNavItems: filteredNavItems.filter(item => 
      ['/recruitment', '/performance'].includes(item.path)
    ),
    
    adminNavItems: filteredNavItems.filter(item => 
      ['/companies'].includes(item.path)
    )
  };
};
