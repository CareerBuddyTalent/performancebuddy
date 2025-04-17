import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import TaskCounters from "./TaskCounters";
import TasksList from "./TasksList";
import TeamMembersSection from "./TeamMembersSection";
import NotificationsList from "./NotificationsList";
import TeamReviewStatus from "./TeamReviewStatus";
import { useAuth } from "@/context/AuthContext";

interface MainContentProps {
  tasks: any[];
  teamMembers: any[];
  todoCount: number;
  performanceCount: number;
  recruitmentCount: number;
  hrCount: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleNavigate: (path: string) => void;
}

export default function MainContent({
  tasks,
  teamMembers,
  todoCount,
  performanceCount,
  recruitmentCount,
  hrCount,
  activeTab,
  setActiveTab,
  handleNavigate,
}: MainContentProps) {
  const { user } = useAuth();
  const isManager = user?.role === 'manager';

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="flex-1 space-y-6">
        {isManager && (
          <TeamReviewStatus 
            teamMembers={teamMembers.map(member => ({
              ...member,
              status: 'not_started',
              daysOverdue: Math.floor(Math.random() * 10) // Mock data for demonstration
            }))}
          />
        )}
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Important Updates</span>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => handleNavigate('/notifications')}>
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>Latest announcements and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationsList />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Tasks</CardTitle>
            <CardDescription>Track your pending tasks and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskCounters 
              todoCount={todoCount}
              performanceCount={performanceCount}
              recruitmentCount={recruitmentCount}
              hrCount={hrCount}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Action Items</CardTitle>
              <div>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="tasks">All</TabsTrigger>
                    <TabsTrigger value="today">Today</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            <CardDescription className="mt-1">Tasks requiring your attention</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs value={activeTab}>
              <TabsContent value="tasks" className="mt-0">
                <TasksList tasks={tasks} />
              </TabsContent>
              <TabsContent value="today" className="mt-0">
                <TasksList tasks={tasks.filter(task => task.dueIn.includes("1 day"))} />
              </TabsContent>
              <TabsContent value="upcoming" className="mt-0">
                <TasksList tasks={tasks.filter(task => !task.dueIn.includes("1 day"))} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="w-full lg:w-80">
        <TeamMembersSection members={teamMembers} />
      </div>
    </div>
  );
}
