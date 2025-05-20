
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ReviewTemplateType } from "@/types/templates";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TemplateBasicInfoProps {
  initialData: {
    name: string;
    description: string;
    type: ReviewTemplateType;
  };
  onSubmit: (data: { name: string; description: string; type: ReviewTemplateType }) => void;
}

export default function TemplateBasicInfo({ initialData, onSubmit }: TemplateBasicInfoProps) {
  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description);
  const [type, setType] = useState<ReviewTemplateType>(initialData.type);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, type });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Template Name</Label>
        <Input 
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Quarterly Performance Review"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea 
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of this template's purpose..."
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Template Type</Label>
        <RadioGroup 
          value={type} 
          onValueChange={(v) => setType(v as ReviewTemplateType)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
        >
          <div className="flex items-center space-x-2 border rounded-md p-4">
            <RadioGroupItem value="self" id="self" />
            <Label htmlFor="self" className="flex-1 cursor-pointer">
              <div className="font-medium">Self Review</div>
              <div className="text-sm text-muted-foreground">For employees to evaluate their own performance</div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4">
            <RadioGroupItem value="peer" id="peer" />
            <Label htmlFor="peer" className="flex-1 cursor-pointer">
              <div className="font-medium">Peer Review</div>
              <div className="text-sm text-muted-foreground">For team members to provide feedback on colleagues</div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4">
            <RadioGroupItem value="manager" id="manager" />
            <Label htmlFor="manager" className="flex-1 cursor-pointer">
              <div className="font-medium">Manager Review</div>
              <div className="text-sm text-muted-foreground">For managers to evaluate their direct reports</div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4">
            <RadioGroupItem value="360" id="360" />
            <Label htmlFor="360" className="flex-1 cursor-pointer">
              <div className="font-medium">360° Review</div>
              <div className="text-sm text-muted-foreground">Comprehensive feedback from multiple perspectives</div>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit">
          Next: Add Sections
        </Button>
      </div>
    </form>
  );
}
