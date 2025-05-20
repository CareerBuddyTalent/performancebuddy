
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays, addMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { PerformanceImprovementPlan, PIPObjective } from "@/types/templates";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CreatePIPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (pip: PerformanceImprovementPlan) => void;
}

export default function CreatePIPDialog({
  open,
  onOpenChange,
  onSubmit
}: CreatePIPDialogProps) {
  const [employee, setEmployee] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addMonths(new Date(), 3));
  const [objectives, setObjectives] = useState<Partial<PIPObjective>[]>([
    { description: "", successCriteria: "", status: "not_started" }
  ]);

  // Mock employees
  const employees = [
    { id: "emp1", name: "John Doe", avatar: "https://ui-avatars.com/api/?name=John+Doe" },
    { id: "emp2", name: "Emily Chen", avatar: "https://ui-avatars.com/api/?name=Emily+Chen" },
    { id: "emp3", name: "Michael Brown", avatar: "https://ui-avatars.com/api/?name=Michael+Brown" },
  ];

  const addObjective = () => {
    setObjectives([...objectives, { description: "", successCriteria: "", status: "not_started" }]);
  };

  const removeObjective = (index: number) => {
    if (objectives.length > 1) {
      const newObjectives = [...objectives];
      newObjectives.splice(index, 1);
      setObjectives(newObjectives);
    }
  };

  const updateObjective = (index: number, key: keyof PIPObjective, value: string) => {
    const newObjectives = [...objectives];
    newObjectives[index] = { ...newObjectives[index], [key]: value };
    setObjectives(newObjectives);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employee || !startDate || !endDate || objectives.some(o => !o.description || !o.successCriteria)) {
      return;
    }
    
    // Create PIP object
    const pip: PerformanceImprovementPlan = {
      id: Math.random().toString(36).substring(2, 9),
      employeeId: employee,
      managerId: "manager1", // Current user ID
      status: "active",
      startDate,
      endDate,
      objectives: objectives.map((obj, index) => ({
        id: `obj-${index}-${Math.random().toString(36).substring(2, 9)}`,
        description: obj.description || "",
        successCriteria: obj.successCriteria || "",
        status: "not_started",
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      meetings: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    onSubmit(pip);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Performance Improvement Plan</DialogTitle>
          <DialogDescription>
            Define objectives and expectations for a team member requiring performance improvement.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Employee</Label>
            <div className="grid grid-cols-3 gap-2">
              {employees.map(emp => (
                <div 
                  key={emp.id}
                  className={`border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-all ${
                    employee === emp.id ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground'
                  }`}
                  onClick={() => setEmployee(emp.id)}
                >
                  <Avatar className="h-12 w-12 mb-2">
                    <AvatarImage src={emp.avatar} alt={emp.name} />
                    <AvatarFallback>{emp.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-center">{emp.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal w-full",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal w-full",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    initialFocus
                    disabled={(date) => date <= startDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Performance Improvement Objectives</Label>
              <Button type="button" variant="outline" size="sm" onClick={addObjective}>
                <Plus className="h-4 w-4 mr-2" />
                Add Objective
              </Button>
            </div>
            
            {objectives.map((objective, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Objective {index + 1}</h4>
                  {objectives.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => removeObjective(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`objective-${index}`}>Description</Label>
                  <Textarea
                    id={`objective-${index}`}
                    placeholder="What needs to be improved..."
                    value={objective.description || ""}
                    onChange={(e) => updateObjective(index, "description", e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`criteria-${index}`}>Success Criteria</Label>
                  <Textarea
                    id={`criteria-${index}`}
                    placeholder="How success will be measured..."
                    value={objective.successCriteria || ""}
                    onChange={(e) => updateObjective(index, "successCriteria", e.target.value)}
                    required
                  />
                </div>
              </div>
            ))}
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={
                !employee || !startDate || !endDate || 
                objectives.some(o => !o.description || !o.successCriteria)
              }
            >
              Create PIP
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
