
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import GoalCard from "@/components/GoalCard";
import { goals } from "@/data/mockData";
import { Goal } from "@/types";
import { Plus, Search } from "lucide-react";

export default function EmployeeGoals() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  if (!user) return null;
  
  // Filter goals based on user role and search query
  const userGoals = user.role === 'employee'
    ? goals.filter(g => g.userId === user.id)
    : goals;
  
  const filteredGoals = userGoals.filter(goal => 
    goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    goal.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Categorize goals by status
  const activeGoals = filteredGoals.filter(g => g.status === 'in_progress');
  const completedGoals = filteredGoals.filter(g => g.status === 'completed');
  const notStartedGoals = filteredGoals.filter(g => g.status === 'not_started');
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {user.role === 'employee' ? 'My Goals' : 'Team Goals'}
        </h1>
        <p className="text-muted-foreground">
          {user.role === 'employee' 
            ? 'Track your personal development goals and career progress' 
            : 'Monitor and manage team goals and development objectives'}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search goals..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {user.role === 'employee' ? 'Add New Goal' : 'Create Team Goal'}
        </Button>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeGoals.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedGoals.length})
          </TabsTrigger>
          <TabsTrigger value="not-started">
            Not Started ({notStartedGoals.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Goals ({filteredGoals.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {activeGoals.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {activeGoals.map((goal: Goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <p className="text-muted-foreground">No active goals found.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {completedGoals.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {completedGoals.map((goal: Goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <p className="text-muted-foreground">No completed goals found.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="not-started" className="space-y-4">
          {notStartedGoals.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {notStartedGoals.map((goal: Goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <p className="text-muted-foreground">No not-started goals found.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          {filteredGoals.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGoals.map((goal: Goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <p className="text-muted-foreground">No goals found matching your search.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
