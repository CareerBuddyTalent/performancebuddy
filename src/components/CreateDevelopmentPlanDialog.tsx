
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Skill, DevelopmentPlan } from "@/types";
import { toast } from "sonner";

import { TitleField } from "./development-plan/TitleField";
import { EmployeeField } from "./development-plan/EmployeeField";
import { SkillsField } from "./development-plan/SkillsField";
import { DescriptionField } from "./development-plan/DescriptionField";
import { formSchema, PlanFormValues } from "./development-plan/PlanFormSchema";

interface CreateDevelopmentPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DevelopmentPlan) => void;
  skills: Skill[];
  employees: { id: string; name: string }[];
}

export function CreateDevelopmentPlanDialog({
  open,
  onOpenChange,
  onSubmit,
  skills,
  employees,
}: CreateDevelopmentPlanDialogProps) {
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      skills: [],
      description: "",
    },
  });

  function handleSubmit(values: PlanFormValues) {
    const newPlan: DevelopmentPlan = {
      id: crypto.randomUUID(),
      employeeId: values.employeeId,
      title: values.title,
      skills: values.skills,
      description: values.description,
      objectives: [],
      createdAt: new Date(),
      modifiedAt: new Date(),
    };

    onSubmit(newPlan);
    toast.success("Development plan created successfully");
    form.reset();
    setSelectedSkills([]);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Development Plan</DialogTitle>
          <DialogDescription>
            Create a new skill development plan for an employee
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <TitleField form={form} />
            <EmployeeField form={form} employees={employees} />
            <SkillsField 
              form={form} 
              skills={skills} 
              selectedSkills={selectedSkills} 
              setSelectedSkills={setSelectedSkills} 
            />
            <DescriptionField form={form} />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Plan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
