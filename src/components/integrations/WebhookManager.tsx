import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Webhook, Plus, Settings, Activity, AlertCircle } from "lucide-react";
import { useState } from "react";

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'disabled' | 'error';
  lastTriggered: Date;
  totalDeliveries: number;
  successRate: number;
}

const mockWebhooks: WebhookEndpoint[] = [
  {
    id: '1',
    name: 'Slack Notifications',
    url: 'https://hooks.slack.com/services/...',
    events: ['review.completed', 'goal.updated'],
    status: 'active',
    lastTriggered: new Date('2024-01-15T10:30:00'),
    totalDeliveries: 247,
    successRate: 98.4
  },
  {
    id: '2',
    name: 'External Analytics',
    url: 'https://api.example.com/webhooks/hr-data',
    events: ['user.created', 'performance.updated'],
    status: 'active',
    lastTriggered: new Date('2024-01-15T09:15:00'),
    totalDeliveries: 89,
    successRate: 100
  }
];

const availableEvents = [
  'user.created',
  'user.updated',
  'user.deleted',
  'review.started',
  'review.completed',
  'goal.created',
  'goal.updated',
  'goal.completed',
  'performance.updated',
  'team.created',
  'survey.completed'
];

export function WebhookManager() {
  const [newWebhookName, setNewWebhookName] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Webhook className="h-5 w-5 text-green-600" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Webhook className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleEvent = (event: string) => {
    setSelectedEvents(prev =>
      prev.includes(event)
        ? prev.filter(e => e !== event)
        : [...prev, event]
    );
  };

  return (
    <div className="space-y-6">
      {/* Webhook Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">2</div>
            <p className="text-sm text-muted-foreground">Active Webhooks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">336</div>
            <p className="text-sm text-muted-foreground">Total Deliveries</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">99.1%</div>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">Failed Deliveries</p>
          </CardContent>
        </Card>
      </div>

      {/* Create New Webhook */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Webhook</CardTitle>
          <CardDescription>Set up a new webhook endpoint to receive real-time events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-name">Webhook Name</Label>
              <Input
                id="webhook-name"
                placeholder="e.g., Slack Notifications"
                value={newWebhookName}
                onChange={(e) => setNewWebhookName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Endpoint URL</Label>
              <Input
                id="webhook-url"
                placeholder="https://your-app.com/webhooks"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Events to Subscribe</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableEvents.map((event) => (
                <div
                  key={event}
                  className={`p-2 border rounded cursor-pointer transition-colors ${
                    selectedEvents.includes(event)
                      ? 'bg-blue-50 border-blue-300'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleEvent(event)}
                >
                  <span className="text-sm">{event}</span>
                </div>
              ))}
            </div>
          </div>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Webhook
          </Button>
        </CardContent>
      </Card>

      {/* Existing Webhooks */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook Endpoints</CardTitle>
          <CardDescription>Manage your webhook endpoints and monitor their performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockWebhooks.map((webhook) => (
            <div key={webhook.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getStatusIcon(webhook.status)}
                  <div>
                    <h4 className="font-semibold">{webhook.name}</h4>
                    <p className="text-sm text-muted-foreground">{webhook.url}</p>
                  </div>
                  <Badge className={getStatusColor(webhook.status)}>
                    {webhook.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={webhook.status === 'active'} />
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Activity className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Subscribed Events:</p>
                  <div className="flex flex-wrap gap-1">
                    {webhook.events.map((event) => (
                      <Badge key={event} variant="outline" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Last Triggered</p>
                    <p className="text-muted-foreground">{webhook.lastTriggered.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">Total Deliveries</p>
                    <p className="text-muted-foreground">{webhook.totalDeliveries}</p>
                  </div>
                  <div>
                    <p className="font-medium">Success Rate</p>
                    <p className="text-muted-foreground">{webhook.successRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Webhook Testing */}
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Test Your Webhooks</h3>
          <p className="text-muted-foreground mb-4">
            Send test events to verify your webhook endpoints are working correctly
          </p>
          <Button variant="outline">Send Test Event</Button>
        </CardContent>
      </Card>
    </div>
  );
}
