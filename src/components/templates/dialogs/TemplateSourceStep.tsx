
import { ReviewTemplate } from "@/types/templates";
import PrebuiltTemplateLibrary from "../PrebuiltTemplateLibrary";

interface TemplateSourceStepProps {
  onStartFromScratch: () => void;
  onSelectPrebuilt: (template: ReviewTemplate) => void;
  onImportTemplate: () => void;
}

export default function TemplateSourceStep({
  onStartFromScratch,
  onSelectPrebuilt,
  onImportTemplate
}: TemplateSourceStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Template Source</h3>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div 
            className="border rounded-lg p-4 hover:bg-accent cursor-pointer flex flex-col items-center justify-center text-center h-32"
            onClick={onStartFromScratch}
          >
            <h4 className="font-medium">Start from Scratch</h4>
            <p className="text-sm text-muted-foreground mt-2">
              Build a custom template with your own sections and questions
            </p>
          </div>
          <div 
            className="border rounded-lg p-4 hover:bg-accent cursor-pointer flex flex-col items-center justify-center text-center h-32"
            onClick={onImportTemplate}
          >
            <h4 className="font-medium">Import Template</h4>
            <p className="text-sm text-muted-foreground mt-2">
              Upload an existing template from your computer
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium mb-4">Or select from our template library:</h4>
          <PrebuiltTemplateLibrary onSelect={onSelectPrebuilt} />
        </div>
      </div>
    </div>
  );
}
