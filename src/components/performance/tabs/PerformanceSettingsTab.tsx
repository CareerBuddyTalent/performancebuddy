
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GoalSettingsDialog from "@/components/performance/GoalSettingsDialog";
import ManageCyclesDialog from "@/components/performance/ManageCyclesDialog";
import ManageReportsDialog from "@/components/performance/ManageReportsDialog";
import SetPermissionsDialog from "@/components/performance/SetPermissionsDialog";
import { Calendar, FileChart, ShieldCheck, Settings } from "lucide-react";

export default function PerformanceSettingsTab() {
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [isCyclesOpen, setIsCyclesOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Performance Settings</CardTitle>
          <CardDescription>Configure performance metrics and review cycles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Review Cycles</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your organization's review cycles and timing
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsCyclesOpen(true)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Cycles
                </Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Goal Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure goal types, weights, and approval flows
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsConfigureOpen(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Reporting</h3>
                <p className="text-sm text-muted-foreground">
                  Set up automated reports and export settings
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsReportsOpen(true)}
                >
                  <FileChart className="h-4 w-4 mr-2" />
                  Manage Reports
                </Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Permissions</h3>
                <p className="text-sm text-muted-foreground">
                  Control who can view and manage performance data
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsPermissionsOpen(true)}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Set Permissions
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <GoalSettingsDialog 
        open={isConfigureOpen} 
        onOpenChange={setIsConfigureOpen} 
      />

      <ManageCyclesDialog
        open={isCyclesOpen}
        onOpenChange={setIsCyclesOpen}
      />

      <ManageReportsDialog
        open={isReportsOpen}
        onOpenChange={setIsReportsOpen}
      />

      <SetPermissionsDialog
        open={isPermissionsOpen}
        onOpenChange={setIsPermissionsOpen}
      />
    </>
  );
}
