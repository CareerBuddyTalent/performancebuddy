
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewTemplate, ReviewTemplateType } from "@/types/templates";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, Eye, Star } from "lucide-react";

interface PrebuiltTemplateLibraryProps {
  onSelect: (template: ReviewTemplate) => void;
}

// Sample pre-built templates that can be expanded
const prebuiltTemplates: ReviewTemplate[] = [
  {
    id: "annual-performance-review",
    name: "Annual Performance Review",
    description: "Comprehensive annual review focused on performance against goals and development",
    type: "manager",
    sections: [
      {
        id: "goals",
        title: "Goal Attainment",
        description: "Assessment of performance against set goals",
        order: 1,
        questions: [
          {
            id: "goal-completion",
            text: "How well did the employee meet their goals for this period?",
            type: "rating",
            required: true,
            order: 1,
            ratingScale: { min: 1, max: 5, labels: { 1: "Did not meet", 3: "Met expectations", 5: "Exceeded" } }
          },
          {
            id: "goal-quality",
            text: "Evaluate the quality of work delivered for key objectives:",
            type: "rating",
            required: true,
            order: 2,
            ratingScale: { min: 1, max: 5 }
          }
        ]
      },
      {
        id: "competencies",
        title: "Core Competencies",
        order: 2,
        questions: [
          {
            id: "communication",
            text: "Communication effectiveness",
            type: "rating",
            required: true,
            order: 1,
            ratingScale: { min: 1, max: 5 }
          },
          {
            id: "teamwork",
            text: "Teamwork and collaboration",
            type: "rating",
            required: true,
            order: 2,
            ratingScale: { min: 1, max: 5 }
          }
        ]
      }
    ],
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    isDefault: true
  },
  {
    id: "360-feedback",
    name: "360° Feedback Review",
    description: "Multi-perspective feedback from peers, managers, direct reports, and self-assessment",
    type: "360",
    sections: [
      {
        id: "strengths",
        title: "Key Strengths",
        description: "Areas where the employee excels",
        order: 1,
        questions: [
          {
            id: "observed-strengths",
            text: "What strengths have you observed in this team member?",
            type: "text",
            required: true,
            order: 1
          }
        ]
      },
      {
        id: "development",
        title: "Development Areas",
        description: "Areas where the employee could improve",
        order: 2,
        questions: [
          {
            id: "growth-areas",
            text: "What areas would you suggest for growth and development?",
            type: "text",
            required: true,
            order: 1
          }
        ]
      }
    ],
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    isDefault: true
  },
  {
    id: "project-completion",
    name: "Project Completion Review",
    description: "Evaluation of performance and outcomes following project completion",
    type: "peer",
    sections: [
      {
        id: "project-execution",
        title: "Project Execution",
        order: 1,
        questions: [
          {
            id: "timeline-adherence",
            text: "How well did the team member adhere to project timelines?",
            type: "rating",
            required: true,
            order: 1,
            ratingScale: { min: 1, max: 5 }
          },
          {
            id: "quality-delivery",
            text: "Rate the quality of deliverables:",
            type: "rating",
            required: true,
            order: 2,
            ratingScale: { min: 1, max: 5 }
          }
        ]
      }
    ],
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    isDefault: false
  }
];

export default function PrebuiltTemplateLibrary({ onSelect }: PrebuiltTemplateLibraryProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const { toast } = useToast();
  
  const filteredTemplates = activeTab === "all" 
    ? prebuiltTemplates 
    : prebuiltTemplates.filter(t => t.type === activeTab);
  
  const handleSelectTemplate = (template: ReviewTemplate) => {
    // Make a copy to avoid modifying the original
    const templateCopy = {
      ...template,
      id: `${template.id}-copy-${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDefault: false
    };
    
    onSelect(templateCopy);
    toast({
      title: "Template Selected",
      description: `${template.name} has been loaded and is ready to customize.`,
    });
  };

  const getTypeLabel = (type: ReviewTemplateType) => {
    switch (type) {
      case "self": return "Self Review";
      case "peer": return "Peer Review";
      case "manager": return "Manager Review";
      case "360": return "360° Review";
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="self">Self</TabsTrigger>
          <TabsTrigger value="peer">Peer</TabsTrigger>
          <TabsTrigger value="manager">Manager</TabsTrigger>
          <TabsTrigger value="360">360°</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="pt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map(template => (
              <Card key={template.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {template.name}
                        {template.isDefault && <Star className="h-4 w-4 text-yellow-500" fill="currentColor"/>}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{getTypeLabel(template.type)}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="text-sm text-muted-foreground">
                    <div className="flex justify-between mb-2">
                      <span>{template.sections.length} sections</span>
                      <span>
                        {template.sections.reduce(
                          (total, section) => total + section.questions.length, 0
                        )} questions
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button variant="ghost" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button variant="default" size="sm" onClick={() => handleSelectTemplate(template)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredTemplates.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No templates found in this category.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
