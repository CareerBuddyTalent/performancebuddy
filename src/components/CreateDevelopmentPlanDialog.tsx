import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skill, DevelopmentPlan } from "@/types";
import { X } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  employeeId: z.string({
    required_error: "Please select an employee.",
  }),
  skills: z.array(z.string()).min(1, {
    message: "Please select at least one skill.",
  }),
  description: z.string().optional(),
});

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      skills: [],
      description: "",
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
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

  const handleSkillSelect = (skillId: string) => {
    const skill = skills.find(s => s.id === skillId);
    if (!skill) return;

    const isAlreadySelected = selectedSkills.some(s => s.id === skillId);
    if (isAlreadySelected) return;
    
    setSelectedSkills(prev => [...prev, skill]);
    form.setValue("skills", [...selectedSkills.map(s => s.id), skillId]);
  };

  const removeSkill = (skillId: string) => {
    setSelectedSkills(prev => prev.filter(skill => skill.id !== skillId));
    form.setValue(
      "skills",
      form.getValues().skills.filter(id => id !== skillId)
    );
  };

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
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Development plan title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={() => (
                <FormItem>
                  <FormLabel>Target Skills</FormLabel>
                  <Select onValueChange={handleSkillSelect}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select skills" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {skills.map(skill => (
                        <SelectItem key={skill.id} value={skill.id}>
                          {skill.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedSkills.map(skill => (
                      <Badge key={skill.id} variant="secondary" className="flex items-center gap-1">
                        {skill.name}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeSkill(skill.id)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the goals of this development plan"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
