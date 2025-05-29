
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, Download } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: number;
  estimatedTime: string;
  popularity: number;
  rating: number;
  usageCount: number;
}

const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Employee Onboarding Flow',
    description: 'Complete onboarding process from hiring to first day activities',
    category: 'HR Operations',
    steps: 8,
    estimatedTime: '5 min setup',
    popularity: 95,
    rating: 4.9,
    usageCount: 2847
  },
  {
    id: '2',
    name: 'Performance Review Cycle',
    description: 'Automated performance review scheduling and reminder system',
    category: 'Performance Management',
    steps: 6,
    estimatedTime: '3 min setup',
    popularity: 87,
    rating: 4.7,
    usageCount: 1523
  },
  {
    id: '3',
    name: 'Goal Setting Workflow',
    description: 'Quarterly goal setting and alignment process automation',
    category: 'Goal Management',
    steps: 5,
    estimatedTime: '4 min setup',
    popularity: 78,
    rating: 4.6,
    usageCount: 1094
  },
  {
    id: '4',
    name: 'Training Completion Tracking',
    description: 'Monitor and follow up on mandatory training completion',
    category: 'Learning & Development',
    steps: 7,
    estimatedTime: '6 min setup',
    popularity: 82,
    rating: 4.8,
    usageCount: 756
  }
];

export function WorkflowTemplates() {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'HR Operations': return 'bg-blue-100 text-blue-800';
      case 'Performance Management': return 'bg-green-100 text-green-800';
      case 'Goal Management': return 'bg-purple-100 text-purple-800';
      case 'Learning & Development': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Workflow Templates</h2>
        <p className="text-muted-foreground">
          Get started quickly with pre-built workflow templates for common HR processes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="mt-1">{template.description}</CardDescription>
                </div>
                <Badge className={getCategoryColor(template.category)}>
                  {template.category}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {template.estimatedTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {template.usageCount} uses
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {template.rating}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium">{template.steps} steps</span>
                  <span className="text-muted-foreground"> • {template.popularity}% popularity</span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm">
                    Use Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Need a Custom Template?</h3>
          <p className="text-muted-foreground mb-4">
            Contact our team to create custom workflow templates for your specific needs
          </p>
          <Button variant="outline">Request Custom Template</Button>
        </CardContent>
      </Card>
    </div>
  );
}
