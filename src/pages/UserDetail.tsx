
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Laptop, Target, LineChart, FileText } from "lucide-react";
import { User, Goal, Skill } from "@/types";
import { users as mockUsers, goals as mockGoals, reviews as mockReviews } from "@/data/mockData";

// Import our new components
import UserProfile from "@/components/users/UserProfile";
import UserOverview from "@/components/users/UserOverview";
import UserGoals from "@/components/users/UserGoals";
import UserSkills from "@/components/users/UserSkills";
import UserReviews from "@/components/users/UserReviews";

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
        <UserProfile 
          user={user}
          averageRating={averageRating}
          userReviews={userReviews}
          userGoals={userGoals}
          userSkills={userSkills}
          getPerformanceColor={getPerformanceColor}
        />
        
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
              <UserOverview user={user} />
            </TabsContent>
            
            <TabsContent value="goals">
              <UserGoals 
                userName={user.name} 
                userGoals={userGoals} 
                department={user.department} 
              />
            </TabsContent>
            
            <TabsContent value="skills">
              <UserSkills userName={user.name} userSkills={userSkills} />
            </TabsContent>
            
            <TabsContent value="reviews">
              <UserReviews 
                userName={user.name} 
                userReviews={userReviews}
                getPerformanceColor={getPerformanceColor} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
