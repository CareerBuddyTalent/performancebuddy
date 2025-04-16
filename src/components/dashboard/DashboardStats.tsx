
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PerformanceReview, User } from "@/types";

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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm font-medium">Total Reviews</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalReviews}</div>
          <p className="text-xs text-muted-foreground">Current review period</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm font-medium">Completed</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedReviews}</div>
          <p className="text-xs text-muted-foreground">
            {user.role === 'employee' ? 'Reviews you\'ve acknowledged' : 'Submitted reviews'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm font-medium">In Progress</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressReviews}</div>
          <p className="text-xs text-muted-foreground">Reviews being worked on</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm font-medium">Goals</div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeGoals}</div>
          <p className="text-xs text-muted-foreground">
            {user.role === 'employee' ? 'Your active goals' : 'Team goals being tracked'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
