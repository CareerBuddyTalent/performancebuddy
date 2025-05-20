
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReviewTemplate, ReviewTemplateType } from "@/types/templates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateBasicInfo from "./TemplateBasicInfo";
import TemplateSections from "./TemplateSections";
import TemplateReview from "./TemplateReview";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from "@/context/AuthContext";

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (template: ReviewTemplate) => void;
}

export default function CreateTemplateDialog({ open, onOpenChange, onCreate }: CreateTemplateDialogProps) {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState<"info" | "sections" | "review">("info");
  const [templateData, setTemplateData] = useState<Partial<ReviewTemplate>>({
    type: "self",
    name: "",
    description: "",
    sections: [],
    isActive: true
  });
  
  const handleBasicInfoSubmit = (data: { name: string; description: string; type: ReviewTemplateType }) => {
    setTemplateData(prev => ({ ...prev, ...data }));
    setActiveStep("sections");
  };
  
  const handleSectionsSubmit = (sections: ReviewTemplate['sections']) => {
    setTemplateData(prev => ({ ...prev, sections }));
    setActiveStep("review");
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
      usageCount: 0
    };
    
    onCreate(newTemplate);
    
    // Reset form
    setTemplateData({
      type: "self",
      name: "",
      description: "",
      sections: [],
      isActive: true
    });
    setActiveStep("info");
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Basic Info</TabsTrigger>
            <TabsTrigger value="sections" disabled={!templateData.name}>Sections & Questions</TabsTrigger>
            <TabsTrigger value="review" disabled={!templateData.sections?.length}>Review & Create</TabsTrigger>
          </TabsList>
          
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
          
          <TabsContent value="review" className="space-y-4 py-4">
            <TemplateReview 
              template={templateData as ReviewTemplate}
              onCreate={handleCreateTemplate}
              onBack={() => setActiveStep("sections")}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
