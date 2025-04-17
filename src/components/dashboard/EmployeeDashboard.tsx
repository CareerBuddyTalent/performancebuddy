import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  UserCircle, BarChart2, Target, FileText, 
  Calendar, ChevronRight, BadgeCheck, Award, TrendingUp, 
  MessageSquare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { useNotificationContext } from "@/context/NotificationContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function EmployeeDashboard({ reviews, goals, feedbackEntries, users, parameters }: any) {
  const { user, requestReview } = useAuth();
  const { addNotification } = useNotificationContext();
  const [activeTab, setActiveTab] = useState("yourReviews");
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [reviewComments, setReviewComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!user) return null;

  // Find user's manager
  const manager = users.find((u: any) => u.name === user.manager);

  // Filter reviews for this employee
  const myReviews = reviews.filter(review => review.employeeId === user.id);
  
  // Filter goals for this employee
  const myGoals = goals.filter(goal => goal.userId === user.id);
  const goalProgress = myGoals.length > 0 
    ? Math.round((myGoals.filter(g => g.status === 'completed').length / myGoals.length) * 100) 
    : 0;
  
  // Current performance period (usually a quarter)
  const currentPeriod = "Q3";
  
  // Placeholder for overall performance grade
  const overallGrade = "Exceeding";

  const handleRequestReviewClick = () => {
    setIsRequestDialogOpen(true);
  };

  const handleRequestReviewSubmit = async () => {
    if (!manager) {
      addNotification({
        title: "Error",
        description: "Could not find your manager. Please contact HR.",
        type: "error",
      });
      setIsRequestDialogOpen(false);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await requestReview(manager.id, reviewComments);
      
      if (success) {
        addNotification({
          title: "Review requested",
          description: `Your request for a performance review has been sent to ${manager.name}`,
          type: "success",
        });
      } else {
        addNotification({
          title: "Request failed",
          description: "There was an error requesting your review. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      addNotification({
        title: "Request failed",
        description: "There was an error requesting your review. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
      setReviewComments("");
      setIsRequestDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile header section */}
      <div className="bg-[#111827] text-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <Avatar className="h-20 w-20 border-2 border-blue-400">
            <AvatarImage src={user.profilePicture} alt={user.name} />
            <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
              <span className="text-gray-300">{user.position || "No position set"}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-300">{user.department || "No department"}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-300">{manager?.name || "No manager"}</span>
            </div>
            
            <div className="hidden md:flex space-x-1">
              <Button size="sm" variant="outline" className="text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-white">
                <MessageSquare className="mr-1 h-4 w-4" />
                Add feedback
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2">
        <Button 
          variant="ghost" 
          className="flex items-center whitespace-nowrap rounded-full"
          asChild
        >
          <Link to="/user/profile">
            <UserCircle className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </Button>
        
        <Button 
          variant="ghost" 
          className="flex items-center whitespace-nowrap rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300"
          asChild
        >
          <Link to="/dashboard">
            <BarChart2 className="mr-2 h-4 w-4" />
            Performance
          </Link>
        </Button>
        
        <Button 
          variant="ghost" 
          className="flex items-center whitespace-nowrap rounded-full"
          asChild
        >
          <Link to="/goals">
            <Target className="mr-2 h-4 w-4" />
            Goals • {goalProgress}%
          </Link>
        </Button>
        
        <Button 
          variant="ghost" 
          className="flex items-center whitespace-nowrap rounded-full"
          asChild
        >
          <Link to="/feedback">
            <FileText className="mr-2 h-4 w-4" />
            Roadmap
          </Link>
        </Button>
      </div>
      
      {/* Performance progression section */}
      <Card className="border border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Overall Grade */}
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-full bg-cyan-100 dark:bg-cyan-900/30">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">{currentPeriod}</span>
                </div>
                <div className="absolute inset-0">
                  <svg viewBox="0 0 100 100" className="h-full w-full rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      strokeLinecap="round"
                      className="text-cyan-500 dark:text-cyan-400"
                      strokeDasharray="283"
                      strokeDashoffset="70"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-cyan-500 dark:text-cyan-400">{overallGrade}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Overall grade</div>
              </div>
            </div>
            
            {/* Review cycles */}
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold">3/4</span>
                </div>
                <div className="absolute inset-0">
                  <svg viewBox="0 0 100 100" className="h-full w-full rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      strokeLinecap="round"
                      className="text-blue-500 dark:text-blue-400"
                      strokeDasharray="283"
                      strokeDashoffset="70"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <div className="text-xl font-bold">Review cycles</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">4 cycles required</div>
              </div>
            </div>
            
            {/* Performing grades */}
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold">1/2</span>
                </div>
                <div className="absolute inset-0">
                  <svg viewBox="0 0 100 100" className="h-full w-full rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      strokeLinecap="round"
                      className="text-purple-500 dark:text-purple-400"
                      strokeDasharray="283"
                      strokeDashoffset="140"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <div className="text-xl font-bold">Performing grades</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">2 required</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Review cycles section */}
      <div className="flex justify-between items-center">
        <Tabs 
          defaultValue="yourReviews" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full justify-start border-b rounded-none px-0 h-auto mb-6">
            <TabsTrigger 
              value="yourReviews" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent py-2 px-4"
            >
              Your review cycles
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent py-2 px-4"
            >
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="yourReviews" className="mt-0">
            <div className="flex justify-end mb-4">
              <Button onClick={handleRequestReviewClick}>
                Request review
              </Button>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Current/Upcoming Review */}
              <Card className="border border-gray-200 dark:border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <span className="font-bold">Q4</span>
                    </div>
                    <div>
                      <div className="text-lg font-medium">Mid III</div>
                      <div className="text-sm text-gray-500">Q4 '24</div>
                    </div>
                    <Badge className="ml-auto bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300">
                      Upcoming
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              {/* Previous Review */}
              <Card className="border border-gray-200 dark:border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <span className="font-bold">Q3</span>
                    </div>
                    <div>
                      <div className="text-lg font-medium">Mid II</div>
                      <div className="text-sm text-gray-500">Q3 '24</div>
                    </div>
                    <Badge className="ml-auto bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
                      Exceeding
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Previous detailed review */}
            <Card className="mt-6 border border-gray-200 dark:border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
                <div>
                  <CardTitle className="text-lg">Q2 2023</CardTitle>
                  <Badge variant="outline" className="mt-1">Previous</Badge>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center text-amber-600 dark:text-amber-400">
                    <span className="font-medium">Developing</span>
                    <TrendingUp className="ml-1 h-4 w-4" />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Grade</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Timeline</h4>
                  <div className="relative">
                    <div className="absolute left-0 top-4 h-0.5 w-full bg-gray-200 dark:bg-gray-700"></div>
                    <div className="relative flex justify-between">
                      {/* Goal setting */}
                      <div className="flex flex-col items-center">
                        <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                          <BadgeCheck className="h-4 w-4" />
                        </div>
                        <span className="mt-2 text-xs font-medium">Goal setting</span>
                        <span className="text-xs text-gray-500">Closed 1 Apr</span>
                      </div>
                      
                      {/* Nomination */}
                      <div className="flex flex-col items-center">
                        <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                          <BadgeCheck className="h-4 w-4" />
                        </div>
                        <span className="mt-2 text-xs font-medium">Nomination</span>
                        <span className="text-xs text-gray-500">Closed</span>
                      </div>
                      
                      {/* Review */}
                      <div className="flex flex-col items-center">
                        <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                          <BadgeCheck className="h-4 w-4" />
                        </div>
                        <span className="mt-2 text-xs font-medium">Review</span>
                        <span className="text-xs text-gray-500">Closed 17 Jun</span>
                      </div>
                      
                      {/* Calibration */}
                      <div className="flex flex-col items-center">
                        <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                          <BadgeCheck className="h-4 w-4" />
                        </div>
                        <span className="mt-2 text-xs font-medium">Calibration</span>
                        <span className="text-xs text-gray-500">Closed 25 Jul</span>
                      </div>
                      
                      {/* Results */}
                      <div className="flex flex-col items-center">
                        <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                          <BadgeCheck className="h-4 w-4" />
                        </div>
                        <span className="mt-2 text-xs font-medium">Results</span>
                        <span className="text-xs text-gray-500">Closed 2 Aug</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-0">
            <div className="flex h-[200px] items-center justify-center border rounded-lg bg-gray-50 dark:bg-gray-800/30">
              <div className="text-center">
                <Award className="mx-auto h-10 w-10 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">Performance Analytics</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Performance analytics will be available after more review cycles.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Request Review Dialog */}
      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Performance Review</DialogTitle>
            <DialogDescription>
              This will send a review request to your manager{manager ? ` (${manager.name})` : ""}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="comments" className="text-sm font-medium">Additional Comments (Optional)</label>
                <Textarea
                  id="comments"
                  placeholder="Add any context or specific areas you'd like feedback on"
                  value={reviewComments}
                  onChange={(e) => setReviewComments(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleRequestReviewSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
