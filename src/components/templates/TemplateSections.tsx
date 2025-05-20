
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ReviewSection, ReviewTemplateType } from "@/types/templates";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SectionQuestions from "./SectionQuestions";
import { v4 as uuidv4 } from 'uuid';

interface TemplateSectionsProps {
  initialSections: ReviewSection[];
  onSubmit: (sections: ReviewSection[]) => void;
  onBack: () => void;
  templateType: ReviewTemplateType;
}

export default function TemplateSections({ initialSections, onSubmit, onBack, templateType }: TemplateSectionsProps) {
  const [sections, setSections] = useState<ReviewSection[]>(initialSections.length ? initialSections : [createEmptySection()]);
  const [expandedSection, setExpandedSection] = useState<string>(sections[0]?.id || '');
  
  function createEmptySection(): ReviewSection {
    return {
      id: uuidv4(),
      title: '',
      order: sections.length,
      questions: []
    };
  }
  
  const addSection = () => {
    const newSection = createEmptySection();
    setSections([...sections, newSection]);
    setExpandedSection(newSection.id);
  };
  
  const updateSection = (index: number, data: Partial<ReviewSection>) => {
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], ...data };
    setSections(updatedSections);
  };
  
  const removeSection = (index: number) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    setSections(updatedSections.map((section, i) => ({ ...section, order: i })));
    
    if (updatedSections.length === 0) {
      const newSection = createEmptySection();
      setSections([newSection]);
      setExpandedSection(newSection.id);
    } else if (expandedSection === sections[index].id) {
      setExpandedSection(updatedSections[0].id);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate sections
    const isValid = sections.every(section => 
      section.title.trim() !== '' && section.questions.length > 0
    );
    
    if (!isValid) {
      alert("Please ensure all sections have titles and at least one question.");
      return;
    }
    
    onSubmit(sections);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Accordion 
        type="single" 
        collapsible 
        value={expandedSection} 
        onValueChange={setExpandedSection}
        className="space-y-4"
      >
        {sections.map((section, index) => (
          <AccordionItem key={section.id} value={section.id} className="border rounded-lg p-1">
            <div className="flex items-center justify-between px-4">
              <AccordionTrigger className="hover:no-underline">
                <h3 className="text-lg font-medium">{section.title || `Section ${index + 1}`}</h3>
              </AccordionTrigger>
              {sections.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSection(index);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
            <AccordionContent className="px-4 pb-4 pt-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`section-${index}-title`}>Section Title</Label>
                  <Input
                    id={`section-${index}-title`}
                    value={section.title}
                    onChange={(e) => updateSection(index, { title: e.target.value })}
                    placeholder="e.g., Performance Goals"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`section-${index}-description`}>Description (Optional)</Label>
                  <Textarea
                    id={`section-${index}-description`}
                    value={section.description || ''}
                    onChange={(e) => updateSection(index, { description: e.target.value })}
                    placeholder="Brief description of this section..."
                    rows={2}
                  />
                </div>
                
                <SectionQuestions 
                  questions={section.questions}
                  onQuestionsChange={(questions) => updateSection(index, { questions })}
                  sectionId={section.id}
                  templateType={templateType}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      <div className="flex justify-center">
        <Button type="button" variant="outline" onClick={addSection} className="w-full max-w-xs">
          <Plus className="h-4 w-4 mr-2" /> Add Section
        </Button>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">
          Next: Review Template
        </Button>
      </div>
    </form>
  );
}
