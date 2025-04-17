
import { useState } from "react";
import { ReviewParameter } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

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
    maxScore: 5
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
      maxScore: 5
    });
  };

  return (
    <div className="border rounded-md p-4">
      <h4 className="text-sm font-medium mb-3">Add New Parameter</h4>
      <div className="space-y-3">
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
          <Label htmlFor="paramDescription">Description (Optional)</Label>
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
        
        <div className="grid grid-cols-2 gap-4">
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
          
          <div className="grid gap-2">
            <Label htmlFor="paramMaxScore">Max Score</Label>
            <Select
              value={parameter.maxScore.toString()}
              onValueChange={(value) => 
                setParameter({
                  ...parameter,
                  maxScore: parseInt(value)
                })
              }
            >
              <SelectTrigger id="paramMaxScore">
                <SelectValue placeholder="Select max score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No Score (Text only)</SelectItem>
                <SelectItem value="3">3-point scale</SelectItem>
                <SelectItem value="5">5-point scale</SelectItem>
                <SelectItem value="10">10-point scale</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
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
