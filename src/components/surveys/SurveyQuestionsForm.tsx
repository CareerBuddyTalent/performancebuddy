
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { SurveyQuestion } from "@/types";
import AddQuestionForm from "./AddQuestionForm";

interface SurveyQuestionsFormProps {
  questions: Partial<SurveyQuestion>[];
  onAddQuestion: (question: Partial<SurveyQuestion>) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function SurveyQuestionsForm({ 
  questions, 
  onAddQuestion, 
  onBack, 
  onSubmit 
}: SurveyQuestionsFormProps) {
  return (
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
        onAddQuestion={onAddQuestion}
        orderIndex={questions.length}
      />

      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          onClick={onSubmit}
          disabled={questions.length === 0}
        >
          Create Survey
        </Button>
      </DialogFooter>
    </div>
  );
}
