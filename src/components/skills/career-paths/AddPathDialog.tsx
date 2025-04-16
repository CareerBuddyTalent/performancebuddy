
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";

interface NewPath {
  title: string;
  color: string;
}

interface AddPathDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPath: (path: NewPath) => Promise<void>;
  isSubmitting: boolean;
}

export function AddPathDialog({ open, onOpenChange, onAddPath, isSubmitting }: AddPathDialogProps) {
  const [newPath, setNewPath] = useState<NewPath>({
    title: "",
    color: "bg-green-500"
  });

  const handleSubmit = async () => {
    await onAddPath(newPath);
    setNewPath({ title: "", color: "bg-green-500" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Career Track</DialogTitle>
          <DialogDescription>
            Create a new career development path for employees
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Track Title</Label>
            <Input 
              id="title"
              value={newPath.title}
              onChange={(e) => setNewPath({...newPath, title: e.target.value})}
              placeholder="e.g. Product Track"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="color">Track Color</Label>
            <div className="flex gap-2">
              {["bg-primary", "bg-secondary", "bg-green-500", "bg-blue-500", "bg-purple-500"].map((color) => (
                <div 
                  key={color}
                  className={`w-8 h-8 rounded-full cursor-pointer ${color} ${newPath.color === color ? 'ring-2 ring-offset-2 ring-ring' : ''}`}
                  onClick={() => setNewPath({...newPath, color})}
                />
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Add Track
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
