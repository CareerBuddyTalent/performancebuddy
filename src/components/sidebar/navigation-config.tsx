
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
  Heart,
  Zap,
  Puzzle,
  GraduationCap,
  Shield,
  TrendingUp
} from "lucide-react";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: any;
  group: 'main' | 'work' | 'admin' | 'advanced' | 'enterprise';
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
    id: 'kpi-tracking',
    label: 'KPI Tracking',
    href: '/kpi-tracking',
    icon: TrendingUp,
    group: 'work',
    roles: ['employee', 'manager', 'admin'],
    badge: 'New'
  },
  {
    id: 'performance-management',
    label: 'Advanced Performance',
    href: '/performance-management',
    icon: TrendingUp,
    group: 'advanced',
    roles: ['manager', 'admin'],
    badge: 'New'
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
    id: 'learning',
    label: 'Learning',
    href: '/learning',
    icon: GraduationCap,
    group: 'advanced',
    roles: ['employee', 'manager', 'admin']
  },
  {
    id: 'workflows',
    label: 'Workflows',
    href: '/workflows',
    icon: Zap,
    group: 'advanced',
    roles: ['manager', 'admin']
  },
  {
    id: 'integrations',
    label: 'Integrations',
    href: '/integrations',
    icon: Puzzle,
    group: 'advanced',
    roles: ['admin']
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    href: '/enterprise',
    icon: Shield,
    group: 'enterprise',
    roles: ['admin']
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
    advancedNavItems: filteredItems.filter(item => item.group === 'advanced'),
    enterpriseNavItems: filteredItems.filter(item => item.group === 'enterprise'),
    adminNavItems: filteredItems.filter(item => item.group === 'admin')
  };
}
