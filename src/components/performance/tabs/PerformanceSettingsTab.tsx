
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PerformanceSettingsTab() {
  return (
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
              <Button variant="outline" size="sm">Manage Cycles</Button>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Goal Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure goal types, weights, and approval flows
              </p>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Reporting</h3>
              <p className="text-sm text-muted-foreground">
                Set up automated reports and export settings
              </p>
              <Button variant="outline" size="sm">Manage Reports</Button>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Permissions</h3>
              <p className="text-sm text-muted-foreground">
                Control who can view and manage performance data
              </p>
              <Button variant="outline" size="sm">Set Permissions</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
