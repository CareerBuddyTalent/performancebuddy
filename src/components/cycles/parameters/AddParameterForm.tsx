
import { useState } from "react";
import { ReviewParameter } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Settings2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import ParameterWeightForm from "./ParameterWeightForm";
import ParameterScoringForm from "./ParameterScoringForm";

interface AddParameterFormProps {
  onAddParameter: (parameter: ReviewParameter) => void;
}

export default function AddParameterForm({ onAddParameter }: AddParameterFormProps) {
  const [parameter, setParameter] = useState<ReviewParameter>({
    id: uuidv4(),
    name: "",
    description: "",
    category: "performance",
    required: true,
    maxScore: 5,
    weight: 0
  });

  const handleSubmit = () => {
    if (!parameter.name.trim()) return;
    onAddParameter({ ...parameter, id: uuidv4() });
    setParameter({
      id: uuidv4(),
      name: "",
      description: "",
      category: "performance",
      required: true,
      maxScore: 5,
      weight: 0
    });
  };

  return (
    <div className="border rounded-md p-4 space-y-4">
      <h4 className="text-sm font-medium">Add New Parameter</h4>
      
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="paramName">Parameter Name</Label>
          <Input
            id="paramName"
            value={parameter.name}
            onChange={(e) => setParameter({
              ...parameter,
              name: e.target.value
            })}
            placeholder="e.g. Communication Skills"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="paramDescription">Description</Label>
          <Textarea
            id="paramDescription"
            value={parameter.description}
            onChange={(e) => setParameter({
              ...parameter,
              description: e.target.value
            })}
            placeholder="Describe what this parameter measures"
            rows={2}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="paramCategory">Category</Label>
          <Select
            value={parameter.category}
            onValueChange={(value: "technical" | "soft" | "performance" | "goals" | "custom") => 
              setParameter({
                ...parameter,
                category: value
              })
            }
          >
            <SelectTrigger id="paramCategory">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="soft">Soft Skills</SelectItem>
              <SelectItem value="technical">Technical Skills</SelectItem>
              <SelectItem value="goals">Goal-related</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="advanced">
            <AccordionTrigger className="text-sm">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Advanced Settings
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <ParameterScoringForm
                maxScore={parameter.maxScore}
                onMaxScoreChange={(score) => setParameter({ ...parameter, maxScore: score })}
              />
              
              <ParameterWeightForm
                weight={parameter.weight || 0}
                onWeightChange={(weight) => setParameter({ ...parameter, weight })}
              />
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="paramRequired" 
                  checked={parameter.required}
                  onCheckedChange={(checked) => 
                    setParameter({
                      ...parameter,
                      required: checked === true
                    })
                  }
                />
                <Label htmlFor="paramRequired">Required parameter</Label>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Button 
          type="button" 
          onClick={handleSubmit}
          className="w-full"
          disabled={!parameter.name.trim()}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Parameter
        </Button>
      </div>
    </div>
  );
}
