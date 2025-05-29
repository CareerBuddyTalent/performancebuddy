
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamSpaces } from "./TeamSpaces";
import { RecognitionSystem } from "./RecognitionSystem";
import { ActivityFeed } from "./ActivityFeed";

export function CollaborationDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Collaboration Hub</h1>
        <p className="text-muted-foreground">
          Connect, collaborate, and celebrate with your team
        </p>
      </div>
      
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Activity Feed</TabsTrigger>
          <TabsTrigger value="teams">Team Spaces</TabsTrigger>
          <TabsTrigger value="recognition">Recognition</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activity">
          <ActivityFeed />
        </TabsContent>
        
        <TabsContent value="teams">
          <TeamSpaces />
        </TabsContent>
        
        <TabsContent value="recognition">
          <RecognitionSystem />
        </TabsContent>
      </Tabs>
    </div>
  );
}
