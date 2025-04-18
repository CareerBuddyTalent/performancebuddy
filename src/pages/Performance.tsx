
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/types/performance-permissions";
import { Plus, Settings } from "lucide-react";
import { toast } from "sonner";
import PerformanceDashboard from "@/components/performance/PerformanceDashboard";
import EmployeeGoals from "@/pages/EmployeeGoals";
import Reviews from "@/pages/Reviews";
import Skills from "@/pages/Skills";
import CreateReviewDialog from "@/components/CreateReviewDialog";
import ManageCyclesDialog from "@/components/performance/ManageCyclesDialog";
import GoalSettingsDialog from "@/components/performance/GoalSettingsDialog";
import { reviewCycles } from "@/data/mockData";

export default function Performance() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isCreateReviewOpen, setIsCreateReviewOpen] = useState(false);
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const { user } = useAuth();
  
  if (!user) return null;

  const handleCreateReview = (review: any) => {
    toast.success("Review created successfully");
    setIsCreateReviewOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Performance Management</h1>
        {(user.role === 'manager' || user.role === 'admin') && (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsConfigureOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
            <Button onClick={() => setIsCreateReviewOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Review
            </Button>
          </div>
        )}
      </div>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            {hasPermission(user.role, 'view_analytics') && (
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            )}
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <PerformanceDashboard />
          </TabsContent>

          <TabsContent value="goals">
            <EmployeeGoals />
          </TabsContent>

          {hasPermission(user.role, 'view_analytics') && (
            <TabsContent value="reviews">
              <Reviews />
            </TabsContent>
          )}

          <TabsContent value="skills">
            <Skills />
          </TabsContent>
        </Tabs>
      </Card>

      {(user.role === 'manager' || user.role === 'admin') && (
        <CreateReviewDialog
          open={isCreateReviewOpen}
          onOpenChange={setIsCreateReviewOpen}
          onCreateReview={handleCreateReview}
          cycles={reviewCycles} 
          currentUser={user}
        />
      )}

      <GoalSettingsDialog 
        open={isConfigureOpen} 
        onOpenChange={setIsConfigureOpen} 
      />
    </div>
  );
}
