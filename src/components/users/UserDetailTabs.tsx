
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Laptop, Target, LineChart, FileText } from "lucide-react";
import { User, Goal, Skill, Review } from "@/types";
import UserOverview from "@/components/users/UserOverview";
import UserGoals from "@/components/users/UserGoals";
import UserSkills from "@/components/users/UserSkills";
import UserReviews from "@/components/users/UserReviews";

interface UserDetailTabsProps {
  user: User;
  userGoals: Goal[];
  userSkills: Skill[];
  userReviews: Review[];
  getPerformanceColor: (rating: number) => string;
}

export default function UserDetailTabs({ 
  user, 
  userGoals, 
  userSkills, 
  userReviews, 
  getPerformanceColor 
}: UserDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
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
  );
}
