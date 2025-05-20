
import { Button } from "@/components/ui/button";
import { ReviewTemplate } from "@/types/templates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TemplateReviewProps {
  template: ReviewTemplate;
  onCreate: () => void;
  onBack: () => void;
}

export default function TemplateReview({ template, onCreate, onBack }: TemplateReviewProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "self": return "Self Review";
      case "peer": return "Peer Review";
      case "manager": return "Manager Review";
      case "360": return "360° Review";
      default: return type;
    }
  };
  
  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "rating": return "Rating Scale";
      case "text": return "Text Response";
      case "multiple_choice": return "Multiple Choice";
      case "skills_assessment": return "Skills Assessment";
      case "goal_evaluation": return "Goal Evaluation";
      default: return type;
    }
  };
  
  const totalQuestions = template.sections.reduce((acc, section) => acc + section.questions.length, 0);
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">{template.name}</h2>
        {template.description && <p className="text-muted-foreground">{template.description}</p>}
        <div className="flex items-center space-x-2">
          <Badge>{getTypeLabel(template.type)}</Badge>
          <Badge variant="outline">{totalQuestions} Questions</Badge>
          <Badge variant="outline">{template.sections.length} Sections</Badge>
        </div>
      </div>
      
      <div className="space-y-4">
        {template.sections.map((section, index) => (
          <Card key={section.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{section.title}</CardTitle>
              {section.description && <p className="text-sm text-muted-foreground">{section.description}</p>}
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                {section.questions.map((question, qIndex) => (
                  <li key={question.id} className="pl-1">
                    <div className="inline-block">
                      <span className="font-medium">{question.text}</span>
                      <div className="flex items-center space-x-2 ml-6 mt-1 text-sm">
                        <Badge variant="outline">{getQuestionTypeLabel(question.type)}</Badge>
                        {question.required && <Badge variant="secondary">Required</Badge>}
                        {question.type === "rating" && question.ratingScale && (
                          <Badge variant="outline">Scale: {question.ratingScale.min}-{question.ratingScale.max}</Badge>
                        )}
                      </div>
                      
                      {question.type === "multiple_choice" && question.options && question.options.length > 0 && (
                        <div className="ml-6 mt-1 text-sm text-muted-foreground">
                          Options: {question.options.join(", ")}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onCreate}>
          Create Template
        </Button>
      </div>
    </div>
  );
}
