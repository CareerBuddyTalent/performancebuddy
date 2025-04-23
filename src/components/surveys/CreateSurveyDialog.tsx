
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Survey, SurveyQuestion } from "@/types";
import AddQuestionForm from "./AddQuestionForm";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreateSurveyDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateSurvey: (survey: Partial<Survey>) => void;
}

interface CreateSurveyForm {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export default function CreateSurveyDialog({ open, onClose, onCreateSurvey }: CreateSurveyDialogProps) {
  const [questions, setQuestions] = useState<Partial<SurveyQuestion>[]>([]);
  const [currentTab, setCurrentTab] = useState('details');
  const { user } = useAuth();
  const form = useForm<CreateSurveyForm>();

  // Check if user has permission to create surveys
  const canCreateSurvey = user?.role === 'admin' || user?.role === 'manager';

  const onSubmit = async (data: CreateSurveyForm) => {
    if (!canCreateSurvey) {
      toast.error("You don't have permission to create surveys");
      return;
    }

    if (questions.length === 0) {
      toast.error("Please add at least one question to the survey.");
      return;
    }

    try {
      // Create a new survey using the onCreateSurvey callback function
      const newSurvey: Partial<Survey> = {
        title: data.title,
        description: data.description,
        start_date: new Date(data.startDate),
        end_date: new Date(data.endDate),
        status: 'draft',
        creator_id: user?.id,
        target_audience: 'all',
        questions: questions.map((q, index) => ({
          id: crypto.randomUUID(),
          survey_id: '',  // Will be set by the parent component
          text: q.text || '',
          type: q.type || 'text',
          options: q.options,
          required: q.required !== undefined ? q.required : true,
          order_index: index,
          created_at: new Date()
        }))
      };
      
      onCreateSurvey(newSurvey);
      
      toast.success("Survey created successfully");
      onClose();
      form.reset();
      setQuestions([]);
    } catch (error) {
      console.error('Error creating survey:', error);
      toast.error("Failed to create survey. Please try again.");
    }
  };

  const handleAddQuestion = (question: Partial<SurveyQuestion>) => {
    if (!canCreateSurvey) {
      toast.error("You don't have permission to add questions");
      return;
    }
    setQuestions([...questions, question]);
  };

  // Show permission error if user doesn't have the right role
  if (!canCreateSurvey) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Survey</DialogTitle>
          </DialogHeader>
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You don't have permission to create surveys. Only administrators and managers can create surveys.
            </AlertDescription>
          </Alert>
          
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Survey</DialogTitle>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Survey Details</TabsTrigger>
            <TabsTrigger value="questions" disabled={!form.getValues('title')}>
              Questions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(() => setCurrentTab('questions'))} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter survey title" {...field} />
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
                          placeholder="Enter survey description" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
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
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit">Next: Add Questions</Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="questions">
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{question.text}</h4>
                  <p className="text-sm text-muted-foreground">
                    Type: {question.type}
                    {question.options && ` • Options: ${question.options.join(', ')}`}
                  </p>
                </div>
              ))}

              <AddQuestionForm 
                onAddQuestion={handleAddQuestion}
                orderIndex={questions.length}
              />

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setCurrentTab('details')}>
                  Back
                </Button>
                <Button 
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={questions.length === 0}
                >
                  Create Survey
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
