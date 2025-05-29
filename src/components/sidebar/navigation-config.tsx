
import { 
  Home, 
  BarChart3, 
  Target, 
  Users, 
  Star, 
  MessageSquare, 
  Settings,
  Building2,
  ClipboardList,
  Award,
  BookOpen,
  Calendar,
  Users2,
  Heart
} from "lucide-react";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: any;
  group: 'main' | 'work' | 'admin';
  roles: string[];
  badge?: string;
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/home',
    icon: Home,
    group: 'main',
    roles: ['employee', 'manager', 'admin']
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    group: 'main',
    roles: ['employee', 'manager', 'admin']
  },
  {
    id: 'performance',
    label: 'Performance',
    href: '/performance',
    icon: Target,
    group: 'work',
    roles: ['employee', 'manager', 'admin']
  },
  {
    id: 'okrs',
    label: 'OKRs',
    href: '/okrs',
    icon: Target,
    group: 'work',
    roles: ['employee', 'manager', 'admin']
  },
  {
    id: 'collaboration',
    label: 'Collaboration',
    href: '/collaboration',
    icon: Heart,
    group: 'work',
    roles: ['employee', 'manager', 'admin']
  },
  {
    id: 'skills',
    label: 'Skills',
    href: '/skills',
    icon: Star,
    group: 'work',
    roles: ['employee', 'manager', 'admin']
  },
  {
    id: 'reviews',
    label: 'Reviews',
    href: '/performance/reviews',
    icon: ClipboardList,
    group: 'work',
    roles: ['employee', 'manager', 'admin']
  },
  {
    id: 'surveys',
    label: 'Surveys',
    href: '/surveys',
    icon: MessageSquare,
    group: 'work',
    roles: ['employee', 'manager', 'admin']
  },
  {
    id: 'users',
    label: 'Users',
    href: '/users',
    icon: Users,
    group: 'admin',
    roles: ['admin', 'manager']
  },
  {
    id: 'companies',
    label: 'Companies',
    href: '/companies',
    icon: Building2,
    group: 'admin',
    roles: ['admin']
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    group: 'main',
    roles: ['employee', 'manager', 'admin']
  }
];

export function getNavigationItemsByGroup(items: NavigationItem[], userRole: string) {
  const filteredItems = items.filter(item => item.roles.includes(userRole));
  
  return {
    mainNavItems: filteredItems.filter(item => item.group === 'main'),
    workNavItems: filteredItems.filter(item => item.group === 'work'),
    adminNavItems: filteredItems.filter(item => item.group === 'admin')
  };
}
