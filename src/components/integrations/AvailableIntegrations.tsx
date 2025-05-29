
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, Zap, Users, Calendar, MessageSquare } from "lucide-react";
import { useState } from "react";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  installations: number;
  icon: any;
  features: string[];
  pricing: 'free' | 'paid' | 'freemium';
}

const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Slack',
    description: 'Send notifications and updates directly to Slack channels',
    category: 'Communication',
    rating: 4.8,
    installations: 12450,
    icon: MessageSquare,
    features: ['Real-time notifications', 'Custom channels', 'Bot integration'],
    pricing: 'free'
  },
  {
    id: '2',
    name: 'Microsoft Teams',
    description: 'Integrate with Teams for seamless collaboration',
    category: 'Communication',
    rating: 4.6,
    installations: 8920,
    icon: Users,
    features: ['Team notifications', 'Meeting scheduling', 'File sharing'],
    pricing: 'free'
  },
  {
    id: '3',
    name: 'Google Calendar',
    description: 'Sync meetings and deadlines with Google Calendar',
    category: 'Productivity',
    rating: 4.9,
    installations: 15600,
    icon: Calendar,
    features: ['Auto scheduling', 'Reminder sync', 'Meeting conflicts'],
    pricing: 'free'
  },
  {
    id: '4',
    name: 'Zapier',
    description: 'Connect with 3000+ apps through Zapier automation',
    category: 'Automation',
    rating: 4.7,
    installations: 6780,
    icon: Zap,
    features: ['Workflow automation', 'Multi-app integration', 'Custom triggers'],
    pricing: 'freemium'
  }
];

export function AvailableIntegrations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredIntegrations = mockIntegrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-red-100 text-red-800';
      case 'freemium': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search integrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Communication">Communication</SelectItem>
            <SelectItem value="Productivity">Productivity</SelectItem>
            <SelectItem value="Automation">Automation</SelectItem>
            <SelectItem value="Analytics">Analytics</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Featured Integrations */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Featured Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-8 w-8 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{integration.rating}</span>
                          </div>
                          <Badge className={getPricingColor(integration.pricing)}>
                            {integration.pricing}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {integration.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {integration.installations.toLocaleString()} installs
                    </span>
                    <Button size="sm">Connect</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Custom Integration */}
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Need a Custom Integration?</h3>
          <p className="text-muted-foreground mb-4">
            Our API allows you to build custom integrations with any service
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline">View API Docs</Button>
            <Button>Request Integration</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
