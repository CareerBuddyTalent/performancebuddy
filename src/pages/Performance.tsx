
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import PerformanceDashboard from "@/components/performance/PerformanceDashboard";
import EmployeeGoals from "@/pages/EmployeeGoals";
import Reviews from "@/pages/Reviews";
import Skills from "@/pages/Skills";

export default function Performance() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <PerformanceDashboard />
          </TabsContent>

          <TabsContent value="goals">
            <EmployeeGoals />
          </TabsContent>

          <TabsContent value="reviews">
            <Reviews />
          </TabsContent>

          <TabsContent value="skills">
            <Skills />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
