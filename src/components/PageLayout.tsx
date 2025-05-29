import {
  BarChart3,
  BookOpen,
  FileText,
  GitBranch,
  Home,
  Settings as SettingsIcon,
  Target,
  TrendingUp,
  User,
  Zap,
  Award,
} from 'lucide-react';
import * as React from 'react';
import { useLocation } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.LucideIcon;
}

interface PageLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { name: 'Home', href: '/home', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Performance', href: '/performance', icon: TrendingUp },
  { name: 'Reviews', href: '/reviews', icon: FileText },
  { name: 'KPI Tracking', href: '/kpi-tracking', icon: Target },
  { name: 'Automated Reviews', href: '/automated-reviews', icon: SettingsIcon },
  { name: 'OKRs', href: '/okrs', icon: Target },
  { name: 'Skills', href: '/skills', icon: Award },
  { name: 'Learning', href: '/learning', icon: BookOpen },
  { name: 'Workflows', href: '/workflows', icon: GitBranch },
  { name: 'Integrations', href: '/integrations', icon: Zap },
];

export function PageLayout({ children }: PageLayoutProps) {
  const { signOut, user } = useSupabaseAuth();
  const location = useLocation();

  const activeLink = (href: string) => {
    return location.pathname === href
      ? 'bg-secondary text-secondary-foreground font-medium'
      : 'text-muted-foreground hover:text-secondary-foreground';
  };

  return (
    <div className="flex h-screen antialiased text-foreground">
      <aside className="flex flex-col border-r w-64">
        <div className="flex items-center justify-between h-16 px-4 py-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Toggle Navigation">
                <User className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <ScrollArea className="h-full">
                <div className="flex flex-col justify-between h-full p-6">
                  <SheetHeader className="place-items-start">
                    <SheetTitle>Account</SheetTitle>
                  </SheetHeader>
                  <Separator />
                  <DropdownMenuContent align="end" forceMount className="w-48">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      Log out
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <span className="text-lg font-bold">HR-GPT</span>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <Separator />
        <ScrollArea className="flex-1">
          <div className="flex flex-col py-2">
            {navigationItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className={`h-9 px-4 justify-start font-normal ${activeLink(item.href)}`}
                onClick={() => (window.location.href = item.href)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.name}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </aside>
      <main className="flex flex-col flex-1 w-full">{children}</main>
    </div>
  );
}
