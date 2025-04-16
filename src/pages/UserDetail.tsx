
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, Building, Users, Target, FileText, Laptop, LineChart } from "lucide-react";
import { User, Goal, Skill } from "@/types";
import { users as mockUsers, goals as mockGoals, reviews as mockReviews } from "@/data/mockData";
import SkillsMatrix from "@/components/SkillsMatrix";

export default function UserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [userGoals, setUserGoals] = useState<Goal[]>([]);
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch user data
  useEffect(() => {
    if (userId) {
      const foundUser = mockUsers.find(u => u.id === userId);
      setUser(foundUser || null);
      
      // Fetch user goals
      const goals = mockGoals.filter(goal => goal.userId === userId);
      setUserGoals(goals);
      
      // Fetch user skills (mocked for now)
      const mockSkills: Skill[] = [
        {
          id: "s1",
          name: "React Development",
          description: "Proficiency in React framework and ecosystem",
          category: "Technical",
          levels: [
            {
              level: 1,
              description: "Basic knowledge of React concepts",
              expectations: ["Can create simple components", "Understands JSX syntax"]
            },
            {
              level: 2,
              description: "Working knowledge of React",
              expectations: ["Can use hooks effectively", "Understands component lifecycle"]
            },
            {
              level: 3,
              description: "Advanced knowledge of React",
              expectations: ["Can build complex applications", "Understands React performance optimization"]
            },
            {
              level: 4,
              description: "Expert in React development",
              expectations: ["Can architect large scale React applications", "Deep knowledge of React internals"]
            },
            {
              level: 5,
              description: "Master of React development",
              expectations: ["Contributes to React ecosystem", "Mentors others in React best practices"]
            }
          ]
        },
        {
          id: "s2",
          name: "Communication Skills",
          description: "Ability to communicate effectively with team members and stakeholders",
          category: "Soft Skills",
          levels: [
            {
              level: 1,
              description: "Basic communication skills",
              expectations: ["Can express simple ideas", "Listens to feedback"]
            },
            {
              level: 2,
              description: "Effective communicator in team settings",
              expectations: ["Clearly articulates ideas", "Actively participates in meetings"]
            },
            {
              level: 3,
              description: "Strong communicator across teams",
              expectations: ["Facilitates team discussions", "Presents complex ideas effectively"]
            },
            {
              level: 4,
              description: "Excellent communicator with leadership qualities",
              expectations: ["Influences decision making", "Mentors others in communication"]
            },
            {
              level: 5,
              description: "Expert communicator at all levels",
              expectations: ["Strategic communication with executives", "Represents the company externally"]
            }
          ]
        }
      ];
      
      setUserSkills(mockSkills);
    }
  }, [userId]);
  
  if (!user) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold">User not found</h1>
        <p className="mt-4">The requested user does not exist or you don't have permission to view it.</p>
        <Button asChild className="mt-6">
          <Link to="/users">Back to User Management</Link>
        </Button>
      </div>
    );
  }
  
  // Calculate performance data
  const userReviews = mockReviews.filter(review => review.employeeId === userId);
  const averageRating = userReviews.length > 0
    ? userReviews.reduce((sum, review) => sum + review.overallRating, 0) / userReviews.length
    : 0;
  
  const getPerformanceColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-blue-600";
    if (rating >= 2) return "text-yellow-600";
    return "text-red-600";
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to User Management
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-1/3">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.profilePicture} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <Badge className="mt-2 capitalize">{user.role}</Badge>
              <p className="text-muted-foreground mt-1">{user.position || "No position set"}</p>
              
              <div className="w-full mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{user.department || "No department"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Reports to: {user.manager || "No manager"}</span>
                </div>
              </div>
              
              <div className="w-full mt-6 pt-6 border-t">
                <div className="text-lg font-medium mb-2">Performance Overview</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground">Average Rating</div>
                    <div className={`text-xl font-bold ${getPerformanceColor(averageRating)}`}>
                      {averageRating.toFixed(1)}/5
                    </div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground">Reviews</div>
                    <div className="text-xl font-bold">{userReviews.length}</div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground">Active Goals</div>
                    <div className="text-xl font-bold">
                      {userGoals.filter(g => g.status !== "completed").length}
                    </div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-xs text-muted-foreground">Skills</div>
                    <div className="text-xl font-bold">{userSkills.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="md:w-2/3 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">
                <Laptop className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="goals">
                <Target className="h-4 w-4 mr-2" />
                Goals
              </TabsTrigger>
              <TabsTrigger value="skills">
                <LineChart className="h-4 w-4 mr-2" />
                Skills
              </TabsTrigger>
              <TabsTrigger value="reviews">
                <FileText className="h-4 w-4 mr-2" />
                Reviews
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>User Overview</CardTitle>
                  <CardDescription>
                    Career path and development summary
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Career Path</h3>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">Current Position</div>
                          <Badge variant="outline">{user.position || "Not set"}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Next Position</div>
                          <Badge variant="outline">Senior {user.position || "Not set"}</Badge>
                        </div>
                        
                        <div className="mt-4 text-sm text-muted-foreground">
                          Time in current role: 1 year, 3 months
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Development Summary</h3>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <Target className="h-5 w-5 mr-2 text-blue-600" />
                            <span className="font-medium">Current Focus Areas</span>
                          </div>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>Technical leadership skills</li>
                            <li>Project management</li>
                            <li>Advanced {user.position} capabilities</li>
                          </ul>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <LineChart className="h-5 w-5 mr-2 text-green-600" />
                            <span className="font-medium">Strengths</span>
                          </div>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>Technical expertise</li>
                            <li>Problem solving</li>
                            <li>Team collaboration</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="goals">
              <Card>
                <CardHeader>
                  <CardTitle>User Goals</CardTitle>
                  <CardDescription>
                    Current and completed goals for {user.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userGoals.length > 0 ? (
                    <div className="space-y-4">
                      {userGoals.map(goal => (
                        <div key={goal.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{goal.title}</h3>
                            <Badge 
                              variant={goal.status === "completed" ? "default" : "outline"}
                              className="capitalize"
                            >
                              {goal.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {goal.description}
                          </p>
                          <div className="mt-4 flex items-center justify-between text-sm">
                            <span>Progress: {goal.progress}%</span>
                            <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      <Target className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>No goals found for this user</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Competencies</CardTitle>
                  <CardDescription>
                    Skills and competency levels for {user.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SkillsMatrix skills={userSkills} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Reviews</CardTitle>
                  <CardDescription>
                    Past performance reviews for {user.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userReviews.length > 0 ? (
                    <div className="space-y-4">
                      {userReviews.map(review => (
                        <div key={review.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">Review from {new Date(review.updatedAt).toLocaleDateString()}</h3>
                            <Badge 
                              variant={review.status === "acknowledged" ? "default" : "outline"}
                              className="capitalize"
                            >
                              {review.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <div className="mt-4 flex items-center">
                            <span className="text-sm text-muted-foreground mr-2">Overall Rating:</span>
                            <span className={`font-bold ${getPerformanceColor(review.overallRating)}`}>
                              {review.overallRating.toFixed(1)}/5
                            </span>
                          </div>
                          <p className="mt-4 text-sm">
                            {review.feedback || "No feedback provided"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>No reviews found for this user</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
