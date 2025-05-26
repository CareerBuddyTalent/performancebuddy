
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useClerkAuth } from "@/context/ClerkAuthContext";
import { Survey, Question } from "@/types";
import { toast } from "sonner";

interface TakeSurveyDialogProps {
  survey: Survey;
  open: boolean;
  onClose: () => void;
  onSubmit: (responses: any) => void;
}

export default function TakeSurveyDialog({ 
  survey, 
  open, 
  onClose, 
  onSubmit 
}: TakeSurveyDialogProps) {
  const { user } = useClerkAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  if (!survey.questions || survey.questions.length === 0) {
    return null;
  }

  const currentQuestion = survey.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion.required && !responses[currentQuestion.id]) {
      toast.error("Please answer this question before continuing");
      return;
    }

    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!user) return;

    // Check if all required questions are answered
    const unansweredRequired = survey.questions?.filter(
      q => q.required && !responses[q.id]
    );

    if (unansweredRequired && unansweredRequired.length > 0) {
      toast.error("Please answer all required questions");
      return;
    }

    const submissionData = {
      surveyId: survey.id,
      userId: user.id,
      responses: Object.entries(responses).map(([questionId, answer]) => ({
        questionId,
        answer: typeof answer === 'string' ? answer : JSON.stringify(answer)
      })),
      submittedAt: new Date()
    };

    onSubmit(submissionData);
    onClose();
    toast.success("Survey submitted successfully");
  };

  const renderQuestionInput = (question: Question) => {
    const currentValue = responses[question.id];

    switch (question.type) {
      case 'text':
        return (
          <Input
            value={currentValue || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            placeholder="Enter your answer"
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={currentValue || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            placeholder="Enter your answer"
            rows={4}
          />
        );

      case 'radio':
        return (
          <RadioGroup
            value={currentValue}
            onValueChange={(value) => handleResponse(question.id, value)}
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={currentValue?.includes(option) || false}
                  onCheckedChange={(checked) => {
                    const current = currentValue || [];
                    if (checked) {
                      handleResponse(question.id, [...current, option]);
                    } else {
                      handleResponse(question.id, current.filter((v: string) => v !== option));
                    }
                  }}
                />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        );

      case 'rating':
        return (
          <RadioGroup
            value={currentValue?.toString()}
            onValueChange={(value) => handleResponse(question.id, parseInt(value))}
            className="flex space-x-4"
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <RadioGroupItem value={rating.toString()} id={`${question.id}-${rating}`} />
                <Label htmlFor={`${question.id}-${rating}`}>{rating}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{survey.title}</DialogTitle>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {survey.questions.length}
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">
              {currentQuestion.text}
              {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            {renderQuestionInput(currentQuestion)}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstQuestion}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button onClick={handleNext}>
              {isLastQuestion ? 'Submit' : 'Next'}
              {!isLastQuestion && <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
