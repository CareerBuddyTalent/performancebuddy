
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClerkAuth } from "@/context/ClerkAuthContext";
import { ReviewTemplate } from "@/types/templates";
import { toast } from "sonner";

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTemplate: (template: ReviewTemplate) => void;
}

export default function CreateTemplateDialog({
  open,
  onOpenChange,
  onCreateTemplate
}: CreateTemplateDialogProps) {
  const { user } = useClerkAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"self" | "manager" | "peer" | "360">("self");

  const handleSubmit = () => {
    if (!user || !name.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newTemplate: ReviewTemplate = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      type,
      isActive: true,
      createdBy: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      sections: []
    };

    onCreateTemplate(newTemplate);
    onOpenChange(false);
    
    // Reset form
    setName("");
    setDescription("");
    setType("self");
    
    toast.success("Template created successfully");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Review Template</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Template Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter template name"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter template description"
              rows={3}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Review Type</label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select review type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="self">Self Assessment</SelectItem>
                <SelectItem value="manager">Manager Review</SelectItem>
                <SelectItem value="peer">Peer Review</SelectItem>
                <SelectItem value="360">360° Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
