
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseLibrary } from "./CourseLibrary";
import { MyLearning } from "./MyLearning";
import { LearningAnalytics } from "./LearningAnalytics";
import { AIRecommendations } from "./AIRecommendations";

export function LearningDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Learning Management</h1>
        <p className="text-muted-foreground">
          Develop skills with AI-powered personalized learning paths
        </p>
      </div>
      
      <Tabs defaultValue="my-learning" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-learning">My Learning</TabsTrigger>
          <TabsTrigger value="library">Course Library</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="analytics">Learning Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-learning">
          <MyLearning />
        </TabsContent>
        
        <TabsContent value="library">
          <CourseLibrary />
        </TabsContent>
        
        <TabsContent value="recommendations">
          <AIRecommendations />
        </TabsContent>
        
        <TabsContent value="analytics">
          <LearningAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
