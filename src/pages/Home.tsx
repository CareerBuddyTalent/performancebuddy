
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart4, Users, Target, MessageSquareMore, FileText } from "lucide-react";
import { reviews, goals, feedbackEntries } from "@/data/mockData";

export default function Home() {
  const { user } = useAuth();

  if (!user) return null;

  // Filter data based on user role
  const userReviews = user.role === 'employee' 
    ? reviews.filter(r => r.employeeId === user.id)
    : user.role === 'manager'
    ? reviews.filter(r => r.reviewerId === user.id)
    : reviews;

  const userGoals = user.role === 'employee'
    ? goals.filter(g => g.userId === user.id)
    : goals;

  const userFeedback = user.role === 'employee'
    ? feedbackEntries.filter(f => f.recipientId === user.id)
    : feedbackEntries;

  // Role-specific paths and quick actions
  const quickActions = {
    admin: [
      { label: "View All Employees", icon: <Users className="h-5 w-5" />, path: "/employees" },
      { label: "Manage Reviews", icon: <FileText className="h-5 w-5" />, path: "/reviews" },
      { label: "Performance Dashboard", icon: <BarChart4 className="h-5 w-5" />, path: "/dashboard" }
    ],
    manager: [
      { label: "View My Team", icon: <Users className="h-5 w-5" />, path: "/team" },
      { label: "Manage Reviews", icon: <FileText className="h-5 w-5" />, path: "/reviews" },
      { label: "Performance Dashboard", icon: <BarChart4 className="h-5 w-5" />, path: "/dashboard" }
    ],
    employee: [
      { label: "View My Reviews", icon: <FileText className="h-5 w-5" />, path: "/my-reviews" },
      { label: "Track Goals", icon: <Target className="h-5 w-5" />, path: "/goals" },
      { label: "Feedback", icon: <MessageSquareMore className="h-5 w-5" />, path: "/feedback" }
    ]
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name}!</h1>
        <p className="text-muted-foreground">
          {user.role === 'admin'
            ? "Manage your organization's performance reviews and track team progress."
            : user.role === 'manager'
            ? "Track your team's progress and manage performance reviews."
            : "Track your performance, set goals, and receive feedback."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Performance Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2 mb-4">
              <div className="text-3xl font-bold">{userReviews.length}</div>
              <p className="text-sm text-muted-foreground">
                {user.role === 'employee'
                  ? "Reviews for you"
                  : user.role === 'manager'
                  ? "Team reviews to complete"
                  : "Total reviews in system"}
              </p>
            </div>
            <Button asChild className="w-full">
              <Link to={user.role === 'employee' ? "/my-reviews" : "/reviews"}>
                {user.role === 'employee' ? "View My Reviews" : "Manage Reviews"}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Goals Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2 mb-4">
              <div className="text-3xl font-bold">{userGoals.length}</div>
              <p className="text-sm text-muted-foreground">
                {user.role === 'employee' ? "Your active goals" : "Team goals"}
              </p>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/goals">
                {user.role === 'employee' ? "Manage My Goals" : "View Team Goals"}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2 mb-4">
              <div className="text-3xl font-bold">{userFeedback.length}</div>
              <p className="text-sm text-muted-foreground">
                {user.role === 'employee' ? "Feedback received" : "Feedback entries"}
              </p>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/feedback">
                {user.role === 'employee' ? "View Feedback" : "Manage Feedback"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickActions[user.role].map((action, index) => (
            <Button key={index} asChild variant="outline" className="h-auto justify-start p-6 text-left">
              <Link to={action.path} className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  {action.icon}
                </div>
                <div>
                  <div className="font-medium">{action.label}</div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
