
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Skill } from "@/types";
import { PlanFormValues } from "./PlanFormSchema";

interface SkillsFieldProps {
  form: UseFormReturn<PlanFormValues>;
  skills: Skill[];
  selectedSkills: Skill[];
  setSelectedSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
}

export function SkillsField({ form, skills, selectedSkills, setSelectedSkills }: SkillsFieldProps) {
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
    <FormField
      control={form.control}
      name="skills"
      render={() => (
        <FormItem>
          <FormLabel>Target Skills</FormLabel>
          <Select onValueChange={handleSkillSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select skills" />
            </SelectTrigger>
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
  );
}
