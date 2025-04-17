
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PerformanceReview, User } from "@/types";
import { BarChart3, Calendar, CheckCircle, Clock } from "lucide-react";

interface DashboardStatsProps {
  user: User;
  myReviews: PerformanceReview[];
  teamReviews: PerformanceReview[];
  goals: any[];
  users: any[];
}

export default function DashboardStats({ 
  user, 
  myReviews, 
  teamReviews, 
  goals, 
  users 
}: DashboardStatsProps) {
  // Calculate stats based on user role
  const totalReviews = user.role === 'employee' ? myReviews.length : teamReviews.length;
  const completedReviews = user.role === 'employee' 
    ? myReviews.filter(r => r.status === 'submitted' || r.status === 'acknowledged').length 
    : teamReviews.filter(r => r.status === 'submitted' || r.status === 'acknowledged').length;

  const inProgressReviews = user.role === 'employee'
    ? myReviews.filter(r => r.status === 'in_progress').length
    : teamReviews.filter(r => r.status === 'in_progress').length;

  // Calculate active goals
  const activeGoals = user.role === 'employee' 
    ? goals.filter(g => g.userId === user.id).length 
    : goals.filter(g => {
        const goalUser = users.find(u => u.id === g.userId);
        return goalUser && goalUser.manager === user.id;
      }).length;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800/40 dark:border-purple-900/30 border-purple-100 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Reviews</div>
          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{totalReviews}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Current review period</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-gray-800/40 dark:border-green-900/30 border-green-100 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Completed</div>
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{completedReviews}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {user.role === 'employee' ? 'Reviews you\'ve acknowledged' : 'Submitted reviews'}
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800/40 dark:border-blue-900/30 border-blue-100 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">In Progress</div>
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{inProgressReviews}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Reviews being worked on</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-gray-800/40 dark:border-amber-900/30 border-amber-100 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Goals</div>
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{activeGoals}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {user.role === 'employee' ? 'Your active goals' : 'Team goals being tracked'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
