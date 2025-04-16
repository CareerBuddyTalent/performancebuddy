
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface AddSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
}

export function AddSkillDialog({ open, onOpenChange, categories }: AddSkillDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Skill</DialogTitle>
          <DialogDescription>
            Define a new skill or competency and set proficiency levels
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="skill-name" className="text-right text-sm font-medium">Name</label>
            <Input id="skill-name" className="col-span-3" placeholder="e.g., Data Analysis" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="skill-category" className="text-right text-sm font-medium">Category</label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
                <SelectItem value="new_category">+ Add New Category</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="skill-description" className="text-right text-sm font-medium">Description</label>
            <Input id="skill-description" className="col-span-3" placeholder="Brief description of the skill" />
          </div>
          
          <Separator className="my-2" />
          
          <h3 className="font-medium">Proficiency Levels</h3>
          
          {[1, 2, 3, 4, 5].map(level => (
            <div key={level} className="grid gap-4">
              <h4 className="text-sm font-medium">Level {level}</h4>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor={`level-${level}-desc`} className="text-right text-sm">Description</label>
                <Input id={`level-${level}-desc`} className="col-span-3" placeholder={`Description for level ${level}`} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor={`level-${level}-exp`} className="text-right text-sm">Expectations</label>
                <Input id={`level-${level}-exp`} className="col-span-3" placeholder="Add expectations separated by commas" />
              </div>
              <Separator className="my-1" />
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button>Save Skill</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
