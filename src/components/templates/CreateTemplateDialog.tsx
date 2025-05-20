
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReviewTemplate, ReviewTemplateType } from "@/types/templates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateBasicInfo from "./TemplateBasicInfo";
import TemplateSections from "./TemplateSections";
import TemplateReview from "./TemplateReview";
import PrebuiltTemplateLibrary from "./PrebuiltTemplateLibrary";
import TemplateAnonymitySettings, { AnonymitySettings } from "./TemplateAnonymitySettings";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from "@/context/AuthContext";

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (template: ReviewTemplate) => void;
}

const defaultAnonymitySettings: AnonymitySettings = {
  isAnonymous: false,
  responseVisibility: "reviewee_visible",
  hideIdentities: false,
  aggregateResults: true,
};

export default function CreateTemplateDialog({ open, onOpenChange, onCreate }: CreateTemplateDialogProps) {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState<"template-source" | "info" | "sections" | "anonymity" | "review">("template-source");
  const [templateData, setTemplateData] = useState<Partial<ReviewTemplate>>({
    type: "self",
    name: "",
    description: "",
    sections: [],
    isActive: true,
    metadata: {
      version: 1,
      anonymitySettings: defaultAnonymitySettings,
      tags: []
    }
  });
  
  const handleBasicInfoSubmit = (data: { name: string; description: string; type: ReviewTemplateType }) => {
    setTemplateData(prev => ({ ...prev, ...data }));
    setActiveStep("sections");
  };
  
  const handleSectionsSubmit = (sections: ReviewTemplate['sections']) => {
    setTemplateData(prev => ({ ...prev, sections }));
    setActiveStep("anonymity");
  };

  const handleAnonymitySettingsChange = (settings: AnonymitySettings) => {
    setTemplateData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        anonymitySettings: settings
      }
    }));
  };

  const handlePrebuiltTemplateSelect = (template: ReviewTemplate) => {
    // Copy the template but keep our metadata structure
    setTemplateData({
      ...template,
      metadata: {
        version: 1,
        anonymitySettings: defaultAnonymitySettings,
        tags: [],
        sourceTemplateId: template.id
      }
    });
    setActiveStep("info");
  };
  
  const handleCreateTemplate = () => {
    if (!user) return;
    
    const newTemplate: ReviewTemplate = {
      id: uuidv4(),
      name: templateData.name!,
      description: templateData.description,
      type: templateData.type as ReviewTemplateType,
      sections: templateData.sections!,
      createdBy: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      metadata: templateData.metadata,
      usageCount: 0
    };
    
    onCreate(newTemplate);
    
    // Reset form
    setTemplateData({
      type: "self",
      name: "",
      description: "",
      sections: [],
      isActive: true,
      metadata: {
        version: 1,
        anonymitySettings: defaultAnonymitySettings,
        tags: []
      }
    });
    setActiveStep("template-source");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Review Template</DialogTitle>
          <DialogDescription>
            Create a new template for reviews. Templates can be used across review cycles.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeStep} className="mt-4" onValueChange={(value) => setActiveStep(value as any)}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="template-source">Source</TabsTrigger>
            <TabsTrigger value="info" disabled={activeStep === "template-source"}>Basic Info</TabsTrigger>
            <TabsTrigger value="sections" disabled={!templateData.name}>Sections</TabsTrigger>
            <TabsTrigger value="anonymity" disabled={!templateData.sections?.length}>Settings</TabsTrigger>
            <TabsTrigger value="review" disabled={!templateData.sections?.length}>Review</TabsTrigger>
          </TabsList>
          
          <TabsContent value="template-source" className="space-y-4 py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Template Source</h3>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className="border rounded-lg p-4 hover:bg-accent cursor-pointer flex flex-col items-center justify-center text-center h-32"
                    onClick={() => {
                      setTemplateData({
                        type: "self",
                        name: "",
                        description: "",
                        sections: [],
                        isActive: true,
                        metadata: {
                          version: 1,
                          anonymitySettings: defaultAnonymitySettings,
                          tags: []
                        }
                      });
                      setActiveStep("info");
                    }}
                  >
                    <h4 className="font-medium">Start from Scratch</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      Build a custom template with your own sections and questions
                    </p>
                  </div>
                  <div 
                    className="border rounded-lg p-4 hover:bg-accent cursor-pointer flex flex-col items-center justify-center text-center h-32"
                    onClick={() => setActiveStep("info")}
                  >
                    <h4 className="font-medium">Import Template</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      Upload an existing template from your computer
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-4">Or select from our template library:</h4>
                  <PrebuiltTemplateLibrary onSelect={handlePrebuiltTemplateSelect} />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="info" className="space-y-4 py-4">
            <TemplateBasicInfo 
              initialData={{ 
                name: templateData.name || '', 
                description: templateData.description || '', 
                type: templateData.type as ReviewTemplateType || 'self' 
              }}
              onSubmit={handleBasicInfoSubmit}
            />
          </TabsContent>
          
          <TabsContent value="sections" className="space-y-4 py-4">
            <TemplateSections 
              initialSections={templateData.sections || []}
              onSubmit={handleSectionsSubmit}
              onBack={() => setActiveStep("info")}
              templateType={templateData.type as ReviewTemplateType}
            />
          </TabsContent>
          
          <TabsContent value="anonymity" className="space-y-4 py-4">
            <TemplateAnonymitySettings
              settings={templateData.metadata?.anonymitySettings || defaultAnonymitySettings}
              onSettingsChange={handleAnonymitySettingsChange}
            />
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setActiveStep("sections")}>
                Back
              </Button>
              <Button onClick={() => setActiveStep("review")}>
                Continue
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="review" className="space-y-4 py-4">
            <TemplateReview 
              template={templateData as ReviewTemplate}
              onCreate={handleCreateTemplate}
              onBack={() => setActiveStep("anonymity")}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
