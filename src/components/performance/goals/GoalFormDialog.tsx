
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Goal } from "@/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { goalFormSchema, GoalFormValues } from "./schema";
import BasicGoalInfo from "./BasicGoalInfo";
import MetricsSection from "./MetricsSection";

interface GoalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Goal | null;
  onSave: (goal: Goal) => void;
}

export default function GoalFormDialog({
  open,
  onOpenChange,
  goal,
  onSave
}: GoalFormDialogProps) {
  const [date, setDate] = useState<Date | undefined>(goal?.dueDate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: goal?.title || "",
      description: goal?.description || "",
      level: goal?.level || "individual",
      status: goal?.status || "not_started",
      progress: goal?.progress || 0,
      metricName: goal?.metrics?.[0]?.name || "",
      metricTarget: goal?.metrics?.[0]?.target || 0,
      metricCurrent: goal?.metrics?.[0]?.current || 0,
      metricUnit: goal?.metrics?.[0]?.unit || "",
    },
  });

  const onSubmit = async (values: GoalFormValues) => {
    if (!date) {
      toast({
        title: "Error",
        description: "Please select a due date",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const updatedGoal: Goal = {
        ...goal,
        title: values.title,
        description: values.description,
        dueDate: date,
        status: values.status,
        progress: values.progress,
        level: values.level,
        metrics: values.metricName ? [{
          name: values.metricName,
          target: values.metricTarget || 0,
          current: values.metricCurrent || 0,
          unit: values.metricUnit || ""
        }] : undefined,
        updatedAt: new Date()
      } as Goal;
      
      onSave(updatedGoal);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save goal",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {goal ? "Edit Goal" : "Create New Goal"}
          </DialogTitle>
          <DialogDescription>
            {goal ? "Update the goal details below." : "Fill out the form below to create a new goal."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BasicGoalInfo form={form} date={date} setDate={setDate} />
            <MetricsSection form={form} />
            
            <DialogFooter>
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting 
                  ? `${goal ? "Updating" : "Creating"}...` 
                  : goal ? "Update Goal" : "Create Goal"
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
