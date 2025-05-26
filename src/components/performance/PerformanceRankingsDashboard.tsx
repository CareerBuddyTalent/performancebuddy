
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, AlertTriangle } from "lucide-react";
import UserPerformanceRanking from "@/components/UserPerformanceRanking";
import TopUnderperformers from "./TopUnderperformers";
import { useRealUsers } from "@/hooks/useRealUsers";
import { useRealReviews } from "@/hooks/useRealReviews";
import { useRealReviewCycles } from "@/hooks/useRealReviewCycles";

export default function PerformanceRankingsDashboard() {
  const [filter, setFilter] = useState<'all' | 'department' | 'cycle'>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedCycle, setSelectedCycle] = useState<string>("all");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  
  const { users } = useRealUsers();
  const { reviews } = useRealReviews();
  const { reviewCycles } = useRealReviewCycles();
  
  // Extract unique departments from users
  const uniqueDepartments = Array.from(
    new Set(users.filter(user => user.department).map(user => user.department))
  ).filter(Boolean) as string[];
  
  // Get active and completed cycles
  const availableCycles = reviewCycles.filter(cycle => 
    cycle.status === 'active' || cycle.status === 'completed'
  );
  
  useEffect(() => {
    let filtered = [...users];
    
    if (filter === 'department' && selectedDepartment !== 'all') {
      filtered = filtered.filter(user => user.department === selectedDepartment);
    }
    
    if (filter === 'cycle' && selectedCycle !== 'all') {
      // Filter users who have reviews in the selected cycle
      const userIdsInCycle = new Set(
        reviews
          .filter(review => review.cycleId === selectedCycle)
          .map(review => review.employeeId)
      );
      
      filtered = filtered.filter(user => userIdsInCycle.has(user.id));
    }
    
    setFilteredUsers(filtered);
  }, [filter, selectedDepartment, selectedCycle, users, reviews]);
  
  return (
    <Card className="shadow-md">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Performance Rankings</CardTitle>
            <CardDescription>
              View top performers and those needing improvement
            </CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row items-end gap-2">
            <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="w-[200px]">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="department">Department</TabsTrigger>
                <TabsTrigger value="cycle">Cycle</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {filter === 'department' && (
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {uniqueDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {filter === 'cycle' && (
              <Select
                value={selectedCycle}
                onValueChange={setSelectedCycle}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cycles</SelectItem>
                  {availableCycles.map((cycle) => (
                    <SelectItem key={cycle.id} value={cycle.id}>
                      {cycle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-medium">Top Performers</h3>
              </div>
            </CardHeader>
            <CardContent>
              <UserPerformanceRanking users={filteredUsers} limit={5} />
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
                <h3 className="text-lg font-medium">Needs Improvement</h3>
              </div>
            </CardHeader>
            <CardContent>
              <TopUnderperformers users={filteredUsers} limit={5} />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
