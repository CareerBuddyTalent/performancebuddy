import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { Survey, SurveyQuestion } from '@/types/surveys';
import { useToast } from '@/hooks/use-toast';

interface TakeSurveyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  survey: Survey | null;
  onSubmit: (responses: { [questionId: string]: string }) => void;
}

export function TakeSurveyDialog({ open, onOpenChange, survey, onSubmit }: TakeSurveyDialogProps) {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [responses, setResponses] = useState<{ [questionId: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Reset responses when the survey changes
    setResponses({});
  }, [survey]);

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prevResponses => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!survey) return;

    setIsSubmitting(true);
    try {
      // Validate that all questions have been answered
      const unansweredQuestions = survey.questions.filter(question => !responses[question.id]);
      if (unansweredQuestions.length > 0) {
        toast({
          title: "Error",
          description: "Please answer all questions before submitting.",
          variant: "destructive",
        });
        return;
      }

      onSubmit(responses);
      toast({
        title: "Survey submitted",
        description: "Thank you for your feedback!",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit survey. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!survey) {
    return null; // Or display a loading state
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{survey.title}</DialogTitle>
          <DialogDescription>{survey.description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {survey.questions.map((question) => (
            <Card key={question.id} className="mb-4">
              <CardHeader>
                <CardTitle>{question.text}</CardTitle>
              </CardHeader>
              <CardContent>
                {question.type === "text" ? (
                  <Textarea
                    placeholder="Your answer"
                    value={responses[question.id] || ""}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  />
                ) : (
                  <RadioGroup
                    defaultValue={responses[question.id] || ""}
                    onValueChange={(value) => handleResponseChange(question.id, value)}
                  >
                    <div className="grid grid-cols-1 gap-2">
                      {question.options?.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                          <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Survey"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

