
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { ReviewSkill } from "@/types";

interface AddSkillFormProps {
  onSkillAdded: (skill: ReviewSkill) => void;
}

export function AddSkillForm({ onSkillAdded }: AddSkillFormProps) {
  const [skillName, setSkillName] = useState("");
  const [skillDescription, setSkillDescription] = useState("");
  const [skillCategory, setSkillCategory] = useState<"technical" | "soft">("technical");
  
  const handleAddSkill = () => {
    if (!skillName.trim()) {
      toast.error("Skill name required", {
        description: "Please provide a name for the skill."
      });
      return;
    }
    
    const newSkill: ReviewSkill = {
      id: crypto.randomUUID(),
      name: skillName,
      description: skillDescription,
      category: skillCategory,
      isActive: true,
      visibleTo: ["admin", "manager", "employee"] // By default, visible to all
    };
    
    onSkillAdded(newSkill);
    
    // Reset form
    setSkillName("");
    setSkillDescription("");
    
    toast.success("Skill added", {
      description: `${skillName} has been added to ${skillCategory} skills.`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Review Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="skill-name">Skill Name</Label>
            <Input
              id="skill-name"
              placeholder="Enter skill name"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="skill-description">Description</Label>
            <Textarea
              id="skill-description"
              placeholder="Enter skill description"
              value={skillDescription}
              onChange={(e) => setSkillDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="skill-category">Category</Label>
            <Select
              value={skillCategory}
              onValueChange={(value) => setSkillCategory(value as "technical" | "soft")}
            >
              <SelectTrigger id="skill-category">
                <SelectValue placeholder="Select skill category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical Skill</SelectItem>
                <SelectItem value="soft">Soft Skill</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddSkill}>
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </CardFooter>
    </Card>
  );
}
