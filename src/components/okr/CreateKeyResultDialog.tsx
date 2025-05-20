
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Objective } from "@/types/okr";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  type: z.enum(["number", "percentage", "currency", "binary"]),
  startValue: z.coerce.number(),
  targetValue: z.coerce.number(),
  unit: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

interface CreateKeyResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  objective: Objective;
  onCreateKeyResult: () => void;
}

export default function CreateKeyResultDialog({ 
  open, 
  onOpenChange, 
  objective,
  onCreateKeyResult
}: CreateKeyResultDialogProps) {
  const [dueDate, setDueDate] = useState<Date>(objective.endDate);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "number",
      startValue: 0,
      targetValue: 100,
      unit: ""
    }
  });

  const watchType = form.watch("type");

  const handleSubmit = (data: FormData) => {
    // In a real app, we would send this data to the API
    console.log("Creating Key Result with data:", {
      ...data,
      dueDate,
      objectiveId: objective.id
    });
    
    onCreateKeyResult();
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Key Result</DialogTitle>
          <DialogDescription>
            Add a measurable key result to track progress on your objective
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
                    <Input placeholder="E.g., Complete 3 certifications" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Measurement Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="currency">Currency</SelectItem>
                      <SelectItem value="binary">Binary (Yes/No)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How will you measure progress on this key result?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starting Value</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        disabled={watchType === "binary"}
                        value={watchType === "binary" ? 0 : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Value</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        disabled={watchType === "binary"}
                        value={watchType === "binary" ? 1 : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {watchType !== "binary" && (
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit {watchType !== "currency" && "(optional)"}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={watchType === "currency" ? "$" : "e.g., tasks, points"} 
                        {...field} 
                        value={watchType === "currency" ? "$" : field.value}
                        required={watchType === "currency"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <div className="space-y-2">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => date && setDueDate(date)}
                    initialFocus
                    disabled={(date) => 
                      date < objective.startDate || 
                      date > objective.endDate
                    }
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Due date must be within the objective timeframe
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Key Result</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
