
import { useState } from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OKRTitleField } from "./OKRTitleField";
import { OKRDescriptionField } from "./OKRDescriptionField";
import { OKRDateFields } from "./OKRDateFields";
import { OKRLevelField } from "./OKRLevelField";
import { Objective } from "@/services/objectiveService";
import { useToast } from "@/hooks/use-toast";

interface OKRFormProps {
  userId: string;
  onSubmit: (objective: Objective) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function OKRForm({ userId, onSubmit, onCancel, isSubmitting }: OKRFormProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [level, setLevel] = useState<"individual" | "team" | "department" | "company">("individual");
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive"
      });
      return;
    }
    
    if (dueDate < startDate) {
      toast({
        title: "Error",
        description: "Due date must be after start date",
        variant: "destructive"
      });
      return;
    }
    
    const newObjective: Objective = {
      user_id: userId,
      title,
      description,
      start_date: startDate.toISOString(),
      due_date: dueDate.toISOString(),
      status: "not_started",
      progress: 0,
      level
    };
    
    onSubmit(newObjective);
  };
  
  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <OKRTitleField value={title} onChange={setTitle} />
      <OKRDescriptionField value={description} onChange={setDescription} />
      <OKRDateFields 
        startDate={startDate}
        dueDate={dueDate}
        onStartDateChange={setStartDate}
        onDueDateChange={setDueDate}
      />
      <OKRLevelField value={level} onChange={setLevel} />
      
      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Objective"}
        </Button>
      </DialogFooter>
    </form>
  );
}
