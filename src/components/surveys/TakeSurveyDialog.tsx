
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Survey, SurveyQuestion, QuestionResponse } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface TakeSurveyDialogProps {
  survey: Survey;
  open: boolean;
  onClose: () => void;
}

export default function TakeSurveyDialog({ survey, open, onClose }: TakeSurveyDialogProps) {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = survey.questions[currentQuestionIndex];

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!user) throw new Error('User not authenticated');

      // Create survey response
      const { data: responseData, error: responseError } = await supabase
        .from('survey_responses')
        .insert({
          survey_id: survey.id,
          user_id: user.id
        })
        .select()
        .single();

      if (responseError) throw responseError;

      // Create question responses
      const questionResponses = Object.entries(answers).map(([questionId, answer]) => ({
        response_id: responseData.id,
        question_id: questionId,
        answer
      }));

      const { error: answersError } = await supabase
        .from('question_responses')
        .insert(questionResponses);

      if (answersError) throw answersError;

      toast({
        title: "Success",
        description: "Survey submitted successfully."
      });

      onClose();
    } catch (error) {
      console.error('Error submitting survey:', error);
      toast({
        title: "Error",
        description: "Failed to submit survey. Please try again.",
        variant: "destructive"
      });
    }
  };

  const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;

  const renderQuestionInput = (question: SurveyQuestion) => {
    switch (question.type) {
      case 'text':
        return (
          <Textarea
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter your answer"
            required={question.required}
          />
        );
      case 'multiple_choice':
        return (
          <RadioGroup
            value={answers[question.id]}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'rating':
        return (
          <Input
            type="number"
            min="1"
            max="5"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            required={question.required}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{survey.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {survey.questions.length}
          </div>

          <div key={currentQuestion.id} className="space-y-4">
            <Label>{currentQuestion.text}</Label>
            {renderQuestionInput(currentQuestion)}
          </div>

          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            {isLastQuestion ? (
              <Button 
                onClick={handleSubmit}
                disabled={!answers[currentQuestion.id] && currentQuestion.required}
              >
                Submit
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                disabled={!answers[currentQuestion.id] && currentQuestion.required}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
