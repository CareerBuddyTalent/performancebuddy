
import { ReviewParameter } from "@/types";
import { Button } from "@/components/ui/button";
import ParameterList from "./ParameterList";
import AddParameterForm from "./AddParameterForm";

interface CycleParametersProps {
  parameters: ReviewParameter[];
  onAddParameter: (parameter: ReviewParameter) => void;
  onDeleteParameter: (id: string) => void;
  onBack: () => void;
}

export default function CycleParameters({
  parameters,
  onAddParameter,
  onDeleteParameter,
  onBack,
}: CycleParametersProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Review Parameters</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={onBack}
        >
          Back to Details
        </Button>
      </div>
      
      <ParameterList 
        parameters={parameters} 
        onDeleteParameter={onDeleteParameter} 
      />
      
      <AddParameterForm onAddParameter={onAddParameter} />
    </div>
  );
}
