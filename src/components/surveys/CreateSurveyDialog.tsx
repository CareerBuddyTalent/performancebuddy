
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Survey, SurveyQuestion } from "@/types";
import AddQuestionForm from "./AddQuestionForm";
import { supabase } from "@/integrations/supabase/client";

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
  const form = useForm<CreateSurveyForm>();

  const onSubmit = async (data: CreateSurveyForm) => {
    if (questions.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one question to the survey.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Insert survey
      const { data: survey, error: surveyError } = await supabase
        .from('surveys')
        .insert({
          title: data.title,
          description: data.description,
          start_date: data.startDate,
          end_date: data.endDate,
          status: 'draft'
        })
        .select()
        .single();

      if (surveyError) throw surveyError;

      // Prepare questions with required properties
      const questionRecords = questions.map(q => ({
        survey_id: survey.id,
        text: q.text || '',
        type: q.type || 'text',
        options: q.options,
        required: q.required === undefined ? true : q.required,
        order_index: q.order_index || 0
      }));

      // Insert questions
      const { error: questionsError } = await supabase
        .from('survey_questions')
        .insert(questionRecords);

      if (questionsError) throw questionsError;

      toast({
        title: "Success",
        description: "Survey created successfully."
      });
      
      onClose();
      form.reset();
      setQuestions([]);
    } catch (error) {
      console.error('Error creating survey:', error);
      toast({
        title: "Error",
        description: "Failed to create survey. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddQuestion = (question: Partial<SurveyQuestion>) => {
    setQuestions([...questions, question]);
  };

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
