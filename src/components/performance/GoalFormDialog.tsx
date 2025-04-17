
import { useState, useEffect } from "react";
import { Goal } from "@/types";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/context/AuthContext";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  // Initialize form with default values or edit values
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      level: "individual",
      status: "not_started",
      progress: 0,
      metricName: "",
      metricTarget: 0,
      metricCurrent: 0,
      metricUnit: "",
    },
  });

  // Update form values when editing a goal
  useEffect(() => {
    if (goal) {
      form.reset({
        title: goal.title,
        description: goal.description,
        level: goal.level,
        status: goal.status,
        progress: goal.progress,
        metricName: goal.metrics?.[0]?.name || "",
        metricTarget: goal.metrics?.[0]?.target || 0,
        metricCurrent: goal.metrics?.[0]?.current || 0,
        metricUnit: goal.metrics?.[0]?.unit || "",
      });
      setDate(goal.dueDate);
    } else {
      form.reset({
        title: "",
        description: "",
        level: "individual",
        status: "not_started",
        progress: 0,
        metricName: "",
        metricTarget: 0,
        metricCurrent: 0,
        metricUnit: "",
      });
      setDate(undefined);
    }
  }, [goal, form]);

  const onSubmit = (data: any) => {
    if (!date) return;
    if (!user) return;
    
    const newGoal: Goal = {
      id: goal?.id || uuidv4(),
      userId: goal?.userId || user.id,
      title: data.title,
      description: data.description,
      dueDate: date,
      status: data.status as "not_started" | "in_progress" | "completed",
      progress: data.progress,
      level: data.level as "individual" | "team" | "department" | "company",
      createdAt: goal?.createdAt || new Date(),
      updatedAt: new Date(),
      metrics: data.metricName ? [{
        name: data.metricName,
        target: data.metricTarget,
        current: data.metricCurrent,
        unit: data.metricUnit
      }] : undefined
    };
    
    onSave(newGoal);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {goal ? "Edit Goal" : "Create New Goal"}
          </DialogTitle>
          <DialogDescription>
            {goal 
              ? "Update the goal details below."
              : "Fill out the form below to create a new goal."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter goal title" 
                      {...field} 
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the goal" 
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="team">Team</SelectItem>
                        <SelectItem value="department">Department</SelectItem>
                        <SelectItem value="company">Company</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="not_started">Not Started</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
              
              <FormField
                control={form.control}
                name="progress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Progress (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0}
                        max={100}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-sm font-medium mb-2">Metrics</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="metricName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Metric Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Revenue, Users, etc." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="metricCurrent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="metricTarget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="metricUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. $, %, hrs" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {goal ? "Update Goal" : "Create Goal"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
