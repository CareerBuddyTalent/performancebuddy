
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Eye, EyeOff, Plus } from 'lucide-react';
import { useEnhancedGoalsData } from '@/hooks/useEnhancedGoalsData';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import GoalsAnalyticsDashboard from './GoalsAnalyticsDashboard';
import EnhancedGoalsList from './EnhancedGoalsList';
import { EnhancedCreateGoalButton } from './EnhancedCreateGoalButton';

export default function IndividualGoalsDashboard() {
  const { user } = useSupabaseAuth();
  const { goals, isLoading } = useEnhancedGoalsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cycleFilter, setCycleFilter] = useState('all');
  const [showSummary, setShowSummary] = useState(true);
  const [activeTab, setActiveTab] = useState('my-goals');

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || goal.status === statusFilter;
    const matchesCycle = cycleFilter === 'all'; // Add cycle filtering logic later
    
    return matchesSearch && matchesStatus && matchesCycle;
  });

  const myGoals = filteredGoals.filter(goal => goal.userId === user?.id);
  const companyGoals = filteredGoals.filter(goal => goal.level === 'company' || goal.level === 'department');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Goals</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || user?.email}! Track your progress and achieve your objectives.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSummary(!showSummary)}
            className="flex items-center gap-2"
          >
            {showSummary ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showSummary ? 'Hide Summary' : 'Show Summary'}
          </Button>
          <EnhancedCreateGoalButton className="bg-purple-600 hover:bg-purple-700" />
        </div>
      </div>

      {/* Analytics Dashboard */}
      {showSummary && (
        <GoalsAnalyticsDashboard goals={myGoals} />
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search goals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={cycleFilter} onValueChange={setCycleFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cycles</SelectItem>
                  <SelectItem value="Q1 2025">Q1 2025</SelectItem>
                  <SelectItem value="Q2 2025">Q2 2025</SelectItem>
                  <SelectItem value="Q3 2025">Q3 2025</SelectItem>
                  <SelectItem value="Q4 2025">Q4 2025</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-goals">
            My Goals ({myGoals.length})
          </TabsTrigger>
          <TabsTrigger value="company-goals">
            Company Goals ({companyGoals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-goals">
          <EnhancedGoalsList 
            goals={myGoals} 
            title="My Goals" 
            showOwner={false}
            emptyMessage="You haven't created any goals yet. Start by creating your first goal!"
          />
        </TabsContent>

        <TabsContent value="company-goals">
          <EnhancedGoalsList 
            goals={companyGoals} 
            title="Company Goals" 
            showOwner={true}
            emptyMessage="No company goals are currently available."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
