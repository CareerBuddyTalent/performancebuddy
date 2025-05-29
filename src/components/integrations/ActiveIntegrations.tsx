
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Settings, Activity, AlertCircle, CheckCircle } from "lucide-react";

interface ActiveIntegration {
  id: string;
  name: string;
  status: 'connected' | 'error' | 'disabled';
  lastSync: Date;
  syncFrequency: string;
  dataTransferred: number;
  errorCount: number;
}

const mockActiveIntegrations: ActiveIntegration[] = [
  {
    id: '1',
    name: 'Slack Workspace',
    status: 'connected',
    lastSync: new Date('2024-01-15T10:30:00'),
    syncFrequency: 'Real-time',
    dataTransferred: 1247,
    errorCount: 0
  },
  {
    id: '2',
    name: 'Google Calendar',
    status: 'connected',
    lastSync: new Date('2024-01-15T09:15:00'),
    syncFrequency: 'Every 15 min',
    dataTransferred: 523,
    errorCount: 2
  },
  {
    id: '3',
    name: 'Microsoft Teams',
    status: 'error',
    lastSync: new Date('2024-01-14T16:45:00'),
    syncFrequency: 'Every 30 min',
    dataTransferred: 89,
    errorCount: 5
  }
];

export function ActiveIntegrations() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Integration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">Active Integrations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">1,859</div>
            <p className="text-sm text-muted-foreground">Data Points Synced</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">99.2%</div>
            <p className="text-sm text-muted-foreground">Uptime</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">7</div>
            <p className="text-sm text-muted-foreground">Total Errors</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Integrations List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Connected Services</h3>
        {mockActiveIntegrations.map((integration) => (
          <Card key={integration.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(integration.status)}
                    <h4 className="font-semibold">{integration.name}</h4>
                    <Badge className={getStatusColor(integration.status)}>
                      {integration.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Last Sync</p>
                      <p className="text-muted-foreground">
                        {integration.lastSync.toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Frequency</p>
                      <p className="text-muted-foreground">{integration.syncFrequency}</p>
                    </div>
                    <div>
                      <p className="font-medium">Data Transferred</p>
                      <p className="text-muted-foreground">{integration.dataTransferred} items</p>
                    </div>
                    <div>
                      <p className="font-medium">Errors</p>
                      <p className={integration.errorCount > 0 ? 'text-red-600' : 'text-muted-foreground'}>
                        {integration.errorCount} errors
                      </p>
                    </div>
                  </div>

                  {integration.status === 'error' && (
                    <div className="mt-3 p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-800">
                        Connection issues detected. Please check your authentication settings.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Switch checked={integration.status !== 'disabled'} />
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Activity className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
