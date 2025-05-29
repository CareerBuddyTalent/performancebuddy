import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Key, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  lastUsed: Date;
  created: Date;
  status: 'active' | 'revoked';
}

const mockAPIKeys: APIKey[] = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'pk_live_51H...',
    permissions: ['read:users', 'write:reviews', 'read:analytics'],
    lastUsed: new Date('2024-01-15T10:30:00'),
    created: new Date('2024-01-01'),
    status: 'active'
  },
  {
    id: '2',
    name: 'Development Key',
    key: 'pk_test_51H...',
    permissions: ['read:users', 'read:reviews'],
    lastUsed: new Date('2024-01-14T16:45:00'),
    created: new Date('2024-01-10'),
    status: 'active'
  }
];

const availablePermissions = [
  'read:users',
  'write:users',
  'read:reviews',
  'write:reviews',
  'read:analytics',
  'write:analytics',
  'read:goals',
  'write:goals'
];

export function APIManagement() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  return (
    <div className="space-y-6">
      {/* API Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">2</div>
            <p className="text-sm text-muted-foreground">Active API Keys</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-sm text-muted-foreground">API Calls Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-sm text-muted-foreground">API Uptime</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">5ms</div>
            <p className="text-sm text-muted-foreground">Avg Response Time</p>
          </CardContent>
        </Card>
      </div>

      {/* Create New API Key */}
      <Card>
        <CardHeader>
          <CardTitle>Create New API Key</CardTitle>
          <CardDescription>Generate a new API key with specific permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="key-name">API Key Name</Label>
              <Input
                id="key-name"
                placeholder="e.g., Mobile App Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {availablePermissions.map((permission) => (
                <div
                  key={permission}
                  className={`p-2 border rounded cursor-pointer transition-colors ${
                    selectedPermissions.includes(permission)
                      ? 'bg-blue-50 border-blue-300'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => togglePermission(permission)}
                >
                  <span className="text-sm">{permission}</span>
                </div>
              ))}
            </div>
          </div>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Generate API Key
          </Button>
        </CardContent>
      </Card>

      {/* Existing API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage your existing API keys and permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockAPIKeys.map((apiKey) => (
            <div key={apiKey.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{apiKey.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Created {apiKey.created.toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={apiKey.status === 'active' ? 'default' : 'secondary'}>
                  {apiKey.status}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
                    {showKeys[apiKey.id] ? apiKey.key : apiKey.key.replace(/./g, '•')}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                  >
                    {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(apiKey.key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Permissions:</p>
                  <div className="flex flex-wrap gap-1">
                    {apiKey.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Last used: {apiKey.lastUsed.toLocaleString()}</span>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Revoke
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">API Documentation</h3>
          <p className="text-muted-foreground mb-4">
            Learn how to integrate with our API and explore available endpoints
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline">View Documentation</Button>
            <Button variant="outline">Download SDKs</Button>
            <Button>Interactive API Explorer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
