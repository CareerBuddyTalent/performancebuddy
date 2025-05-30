
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown, Plus, X, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Goal } from "@/types";

const goalFormSchema = z.object({
  title: z.string().min(3, "Goal title must be at least 3 characters"),
  description: z.string().optional(),
  goalCycle: z.string().min(1, "Please select a goal cycle"),
  startDate: z.date({ required_error: "Start date is required" }),
  dueDate: z.date({ required_error: "Due date is required" }),
  goalType: z.enum(["individual", "team", "department", "company"]),
  visibility: z.enum(["public", "private"]),
  owners: z.array(z.string()).min(1, "At least one owner is required"),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

interface EnhancedGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalCreated: (goal: Goal) => void;
  userId: string;
}

export function EnhancedGoalDialog({ open, onOpenChange, onGoalCreated, userId }: EnhancedGoalDialogProps) {
  const [showDescription, setShowDescription] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [selectedOwners, setSelectedOwners] = useState<string[]>([userId]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: "",
      description: "",
      goalCycle: "Q1 2025",
      startDate: new Date(),
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      goalType: "individual",
      visibility: "public",
      owners: [userId],
    },
  });

  const quarters = [
    "Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025",
    "Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"
  ];

  const mockUsers = [
    { id: userId, name: "You", email: "you@company.com" },
    { id: "user-2", name: "Sarah Johnson", email: "sarah@company.com" },
    { id: "user-3", name: "Mike Chen", email: "mike@company.com" },
    { id: "user-4", name: "Emily Davis", email: "emily@company.com" },
  ];

  const addOwner = (ownerId: string) => {
    if (!selectedOwners.includes(ownerId)) {
      const newOwners = [...selectedOwners, ownerId];
      setSelectedOwners(newOwners);
      form.setValue("owners", newOwners);
    }
  };

  const removeOwner = (ownerId: string) => {
    if (selectedOwners.length > 1) {
      const newOwners = selectedOwners.filter(id => id !== ownerId);
      setSelectedOwners(newOwners);
      form.setValue("owners", newOwners);
    }
  };

  const onSubmit = async (values: GoalFormValues) => {
    setIsSubmitting(true);
    
    try {
      const newGoal: Goal = {
        id: `goal-${Date.now()}`,
        userId: userId,
        title: values.title,
        description: values.description || "",
        dueDate: values.dueDate,
        status: "not_started",
        progress: 0,
        level: values.goalType,
        createdAt: new Date(),
        updatedAt: new Date(),
        milestones: [],
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onGoalCreated(newGoal);
      onOpenChange(false);
      form.reset();
      setShowDescription(false);
      setSelectedOwners([userId]);
    } catch (error) {
      console.error("Failed to create goal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Create Goal</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
            <div className="px-6 py-4 space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter a Goal"
                        className="text-lg font-medium border-0 px-0 focus-visible:ring-0 placeholder:text-muted-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!showDescription && (
                <Button
                  type="button"
                  variant="ghost"
                  className="p-0 h-auto text-purple-600 hover:text-purple-700 hover:bg-transparent"
                  onClick={() => setShowDescription(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add a description
                </Button>
              )}

              {showDescription && (
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Add goal description..."
                          className="min-h-20 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button
                type="button"
                variant="outline"
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                Use Template
              </Button>
            </div>

            <div className="border-t">
              <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between px-6 py-4 hover:bg-gray-50"
                  >
                    <span className="font-medium">Details</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", detailsOpen && "rotate-180")} />
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="px-6 pb-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="goalCycle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal Cycle</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {quarters.map((quarter) => (
                              <SelectItem key={quarter} value={quarter}>
                                {quarter}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? format(field.value, "PPP") : "Select date"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Due Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? format(field.value, "PPP") : "Select date"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormItem>
                    <FormLabel>Owners</FormLabel>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {selectedOwners.map((ownerId) => {
                          const user = mockUsers.find(u => u.id === ownerId);
                          return (
                            <Badge key={ownerId} variant="secondary" className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {user?.name || ownerId}
                              {selectedOwners.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-3 w-3 p-0 hover:bg-transparent"
                                  onClick={() => removeOwner(ownerId)}
                                >
                                  <X className="h-2 w-2" />
                                </Button>
                              )}
                            </Badge>
                          );
                        })}
                      </div>
                      <Select onValueChange={addOwner}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Add owner..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockUsers
                            .filter(user => !selectedOwners.includes(user.id))
                            .map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  <span>{user.name}</span>
                                  <span className="text-muted-foreground text-sm">({user.email})</span>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormItem>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="goalType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Goal Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
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
                      name="visibility"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Visibility</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting ? "Creating..." : "Create Goal"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
