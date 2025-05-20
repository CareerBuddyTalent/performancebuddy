import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ReviewTemplate, ReviewTemplateType } from "@/types/templates";
import { AnonymitySettings } from "../TemplateAnonymitySettings";

const defaultAnonymitySettings: AnonymitySettings = {
  isAnonymous: false,
  responseVisibility: "reviewee_visible",
  hideIdentities: false,
  aggregateResults: true,
};

export default function useTemplateCreation(user: any, onCreate: (template: ReviewTemplate) => void) {
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
  };
  
  const handleSectionsSubmit = (sections: ReviewTemplate['sections']) => {
    setTemplateData(prev => ({ ...prev, sections }));
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
  };
  
  const handleStartFromScratch = () => {
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
    handleStartFromScratch();
  };
  
  return {
    templateData,
    handleBasicInfoSubmit,
    handleSectionsSubmit,
    handleAnonymitySettingsChange,
    handlePrebuiltTemplateSelect,
    handleStartFromScratch,
    handleCreateTemplate
  };
}
