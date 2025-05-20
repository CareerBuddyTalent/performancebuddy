
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReviewTemplate } from "@/types/templates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

import TemplateSourceStep from "./TemplateSourceStep";
import TemplateBasicInfo from "../TemplateBasicInfo";
import TemplateSections from "../TemplateSections";
import TemplateReview from "../TemplateReview";
import TemplateAnonymitySettings from "../TemplateAnonymitySettings";
import useTemplateCreation from "../hooks/useTemplateCreation";

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (template: ReviewTemplate) => void;
}

export default function CreateTemplateDialog({ open, onOpenChange, onCreate }: CreateTemplateDialogProps) {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState<"template-source" | "info" | "sections" | "anonymity" | "review">("template-source");
  
  const {
    templateData,
    handleBasicInfoSubmit,
    handleSectionsSubmit,
    handleAnonymitySettingsChange,
    handlePrebuiltTemplateSelect,
    handleCreateTemplate
  } = useTemplateCreation(user, onCreate);
  
  const handleStartFromScratch = () => {
    setActiveStep("info");
  };
  
  const handleImportTemplate = () => {
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="template-source">Source</TabsTrigger>
            <TabsTrigger value="info" disabled={activeStep === "template-source"}>Basic Info</TabsTrigger>
            <TabsTrigger value="sections" disabled={!templateData.name}>Sections</TabsTrigger>
            <TabsTrigger value="anonymity" disabled={!templateData.sections?.length}>Settings</TabsTrigger>
            <TabsTrigger value="review" disabled={!templateData.sections?.length}>Review</TabsTrigger>
          </TabsList>
          
          <TabsContent value="template-source" className="space-y-4 py-4">
            <TemplateSourceStep
              onStartFromScratch={handleStartFromScratch}
              onSelectPrebuilt={(template) => {
                handlePrebuiltTemplateSelect(template);
                setActiveStep("info");
              }}
              onImportTemplate={handleImportTemplate}
            />
          </TabsContent>
          
          <TabsContent value="info" className="space-y-4 py-4">
            <TemplateBasicInfo 
              initialData={{ 
                name: templateData.name || '', 
                description: templateData.description || '', 
                type: templateData.type || 'self' 
              }}
              onSubmit={(data) => {
                handleBasicInfoSubmit(data);
                setActiveStep("sections");
              }}
            />
          </TabsContent>
          
          <TabsContent value="sections" className="space-y-4 py-4">
            <TemplateSections 
              initialSections={templateData.sections || []}
              onSubmit={(sections) => {
                handleSectionsSubmit(sections);
                setActiveStep("anonymity");
              }}
              onBack={() => setActiveStep("info")}
              templateType={templateData.type || "self"}
            />
          </TabsContent>
          
          <TabsContent value="anonymity" className="space-y-4 py-4">
            <TemplateAnonymitySettings
              settings={templateData.metadata?.anonymitySettings || {
                isAnonymous: false,
                responseVisibility: "reviewee_visible",
                hideIdentities: false,
                aggregateResults: true
              }}
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
