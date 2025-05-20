
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OneOnOneCheckIns from "./OneOnOneCheckIns";
import ContinuousFeedback from "./ContinuousFeedback";
import PeerReviews from "./PeerReviews";
import PIPManagement from "./PIPManagement";
import LineManagerStats from "./LineManagerStats";

export default function LineManagerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Line Manager Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your team's performance, feedback, and development
        </p>
      </div>

      <LineManagerStats />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-background border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="one-on-ones">1:1 Check-Ins</TabsTrigger>
          <TabsTrigger value="feedback">Continuous Feedback</TabsTrigger>
          <TabsTrigger value="peer-reviews">Peer Reviews</TabsTrigger>
          <TabsTrigger value="pip">Performance Improvement</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Overview</CardTitle>
              <CardDescription>
                View your team's performance and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Team overview dashboard content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="one-on-ones" className="space-y-6">
          <OneOnOneCheckIns />
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-6">
          <ContinuousFeedback />
        </TabsContent>
        
        <TabsContent value="peer-reviews" className="space-y-6">
          <PeerReviews />
        </TabsContent>
        
        <TabsContent value="pip" className="space-y-6">
          <PIPManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
