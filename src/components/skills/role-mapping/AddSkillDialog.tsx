
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { AddSkillDialogProps } from "./types";

export function AddSkillDialog({ open, onOpenChange, onAddSkill, isSubmitting }: AddSkillDialogProps) {
  const [newSkill, setNewSkill] = useState({ name: "", proficiency: 3 });

  const handleSubmit = () => {
    onAddSkill(newSkill.name, newSkill.proficiency);
    setNewSkill({ name: "", proficiency: 3 });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Skill</DialogTitle>
          <DialogDescription>
            Define a required skill for this role
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skill-name">Skill Name</Label>
            <Input 
              id="skill-name"
              value={newSkill.name}
              onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
              placeholder="e.g. Project Management"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="proficiency">Required Proficiency Level (1-5)</Label>
            <div className="flex items-center space-x-4">
              <Slider 
                id="proficiency"
                min={1} 
                max={5} 
                step={1} 
                value={[newSkill.proficiency]}
                onValueChange={(value) => setNewSkill({...newSkill, proficiency: value[0]})}
                className="flex-1"
              />
              <Badge>{newSkill.proficiency}</Badge>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Beginner</span>
              <span>Expert</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Add Skill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
