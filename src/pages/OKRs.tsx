
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { toast } from "sonner";
import OKRDashboard from "@/components/okr/OKRDashboard";
import MyObjectives from "@/components/okr/MyObjectives";
import TeamObjectives from "@/components/okr/TeamObjectives";
import CompanyObjectives from "@/components/okr/CompanyObjectives";
import CreateOKRDialog from "@/components/okr/CreateOKRDialog";
import OKRSettingsDialog from "@/components/okr/OKRSettingsDialog";
import OKRPeriodSelector from "@/components/okr/OKRPeriodSelector";

export default function OKRs() {
  const [activeTab, setActiveTab] = useState("my-objectives");
  const [isCreateOKROpen, setIsCreateOKROpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user } = useAuth();
  
  if (!user) return null;

  const isManager = user.role === 'manager' || user.role === 'admin';
  const isAdmin = user.role === 'admin';

  const handleCreateOKR = () => {
    toast.success("Objective created successfully");
    setIsCreateOKROpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Objectives & Key Results</h1>
          <p className="text-muted-foreground">Track and align your objectives with company goals</p>
        </div>
        <div className="flex items-center gap-2">
          <OKRPeriodSelector />
          {(isManager || isAdmin) && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          )}
          <Button onClick={() => setIsCreateOKROpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Objective
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="my-objectives">My Objectives</TabsTrigger>
            {isManager && <TabsTrigger value="team-objectives">Team Objectives</TabsTrigger>}
            <TabsTrigger value="company-objectives">Company Objectives</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="my-objectives">
            <MyObjectives userId={user.id} />
          </TabsContent>

          {isManager && (
            <TabsContent value="team-objectives">
              <TeamObjectives managerId={user.id} />
            </TabsContent>
          )}

          <TabsContent value="company-objectives">
            <CompanyObjectives />
          </TabsContent>

          <TabsContent value="dashboard">
            <OKRDashboard />
          </TabsContent>
        </Tabs>
      </Card>

      <CreateOKRDialog
        open={isCreateOKROpen}
        onOpenChange={setIsCreateOKROpen}
        onCreateOKR={handleCreateOKR}
        userId={user.id}
      />

      {(isManager || isAdmin) && (
        <OKRSettingsDialog 
          open={isSettingsOpen} 
          onOpenChange={setIsSettingsOpen} 
        />
      )}
    </div>
  );
}
