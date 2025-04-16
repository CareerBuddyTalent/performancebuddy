
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { User, Feedback } from "@/types";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { users } from "@/data/mockData";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (feedback: Feedback) => void;
  currentUser: User | null;
}

type FeedbackFormValues = {
  recipientId: string;
  content: string;
  type: 'praise' | 'suggestion' | 'criticism';
  isAnonymous: boolean;
};

export default function FeedbackDialog({
  open,
  onOpenChange,
  onSubmit,
  currentUser
}: FeedbackDialogProps) {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  
  // Create form
  const form = useForm<FeedbackFormValues>({
    defaultValues: {
      recipientId: "",
      content: "",
      type: "praise",
      isAnonymous: false
    }
  });
  
  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);
  
  // Filter out the current user from the recipients list
  useEffect(() => {
    if (currentUser) {
      setFilteredUsers(users.filter(u => u.id !== currentUser.id));
    }
  }, [currentUser]);
  
  const handleSubmit = (values: FeedbackFormValues) => {
    if (!currentUser || !values.recipientId || !values.content) return;
    
    // Create new feedback
    const newFeedback: Feedback = {
      id: uuidv4(),
      senderId: currentUser.id,
      recipientId: values.recipientId,
      content: values.content,
      type: values.type,
      isAnonymous: values.isAnonymous,
      createdAt: new Date()
    };
    
    onSubmit(newFeedback);
    
    // Show success toast
    toast({
      title: "Feedback submitted",
      description: "Your feedback has been submitted successfully."
    });
    
    // Close the dialog
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Give Feedback</DialogTitle>
              <DialogDescription>
                Provide feedback to one of your colleagues. Your feedback will help them improve.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="recipientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a recipient" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredUsers.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} - {user.position || user.department || "No position"}
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
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select feedback type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="praise">Praise</SelectItem>
                        <SelectItem value="suggestion">Suggestion</SelectItem>
                        <SelectItem value="criticism">Constructive Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your feedback here..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isAnonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Submit anonymously
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Feedback</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
