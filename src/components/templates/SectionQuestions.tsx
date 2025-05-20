
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ReviewQuestion, QuestionType, ReviewTemplateType } from "@/types/templates";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';

interface SectionQuestionsProps {
  questions: ReviewQuestion[];
  onQuestionsChange: (questions: ReviewQuestion[]) => void;
  sectionId: string;
  templateType: ReviewTemplateType;
}

export default function SectionQuestions({ questions, onQuestionsChange, sectionId, templateType }: SectionQuestionsProps) {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    questions.length > 0 ? questions[0].id : null
  );
  
  const addQuestion = () => {
    const newQuestion: ReviewQuestion = {
      id: uuidv4(),
      text: "",
      type: "rating",
      required: true,
      order: questions.length
    };
    
    const updatedQuestions = [...questions, newQuestion];
    onQuestionsChange(updatedQuestions);
    setExpandedQuestionId(newQuestion.id);
  };
  
  const updateQuestion = (index: number, data: Partial<ReviewQuestion>) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], ...data };
    onQuestionsChange(updatedQuestions);
  };
  
  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    onQuestionsChange(updatedQuestions.map((q, i) => ({ ...q, order: i })));
    
    if (questions[index].id === expandedQuestionId) {
      setExpandedQuestionId(updatedQuestions.length > 0 ? updatedQuestions[0].id : null);
    }
  };
  
  const getQuestionTypeOptions = () => {
    const options = [
      { value: "rating", label: "Rating Scale" },
      { value: "text", label: "Text Response" },
      { value: "multiple_choice", label: "Multiple Choice" },
    ];
    
    if (templateType === "self" || templateType === "manager") {
      options.push({ value: "goal_evaluation", label: "Goal Evaluation" });
    }
    
    if (templateType === "self" || templateType === "manager" || templateType === "360") {
      options.push({ value: "skills_assessment", label: "Skills Assessment" });
    }
    
    return options;
  };
  
  return (
    <div className="space-y-6 mt-4">
      <h4 className="font-medium text-sm">Questions</h4>
      
      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id} className={`border ${expandedQuestionId === question.id ? 'border-primary' : ''}`}>
            <CardHeader className="p-3 flex flex-row items-center justify-between cursor-pointer"
              onClick={() => setExpandedQuestionId(expandedQuestionId === question.id ? null : question.id)}
            >
              <div className="flex items-center space-x-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">
                  {question.text || `Question ${index + 1}`}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {getQuestionTypeOptions().find(opt => opt.value === question.type)?.label || question.type}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeQuestion(index);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardHeader>
            
            {expandedQuestionId === question.id && (
              <CardContent className="p-3 pt-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`q-${question.id}-text`}>Question Text</Label>
                  <Input
                    id={`q-${question.id}-text`}
                    value={question.text}
                    onChange={(e) => updateQuestion(index, { text: e.target.value })}
                    placeholder="e.g., How would you rate your performance on this goal?"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`q-${question.id}-description`}>Description (Optional)</Label>
                  <Textarea
                    id={`q-${question.id}-description`}
                    value={question.description || ''}
                    onChange={(e) => updateQuestion(index, { description: e.target.value })}
                    placeholder="Additional context for this question..."
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`q-${question.id}-type`}>Question Type</Label>
                    <Select
                      value={question.type}
                      onValueChange={(value) => updateQuestion(index, { type: value as QuestionType })}
                    >
                      <SelectTrigger id={`q-${question.id}-type`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getQuestionTypeOptions().map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2 pt-8">
                    <Label htmlFor={`q-${question.id}-required`} className="cursor-pointer">
                      Required Question
                    </Label>
                    <Switch
                      id={`q-${question.id}-required`}
                      checked={question.required}
                      onCheckedChange={(checked) => updateQuestion(index, { required: checked })}
                    />
                  </div>
                </div>
                
                {question.type === "rating" && (
                  <div className="space-y-2">
                    <Label>Rating Scale</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`q-${question.id}-min`} className="text-sm">Min Value</Label>
                        <Input
                          id={`q-${question.id}-min`}
                          type="number"
                          min="1"
                          max="10"
                          value={question.ratingScale?.min || 1}
                          onChange={(e) => updateQuestion(index, {
                            ratingScale: { 
                              ...(question.ratingScale || { max: 5 }),
                              min: parseInt(e.target.value) 
                            }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`q-${question.id}-max`} className="text-sm">Max Value</Label>
                        <Input
                          id={`q-${question.id}-max`}
                          type="number"
                          min="2"
                          max="10"
                          value={question.ratingScale?.max || 5}
                          onChange={(e) => updateQuestion(index, {
                            ratingScale: { 
                              ...(question.ratingScale || { min: 1 }), 
                              max: parseInt(e.target.value) 
                            }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {question.type === "multiple_choice" && (
                  <div className="space-y-2">
                    <Label>Answer Options</Label>
                    <div className="space-y-2">
                      {(question.options || []).map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center space-x-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(question.options || [])];
                              newOptions[optIndex] = e.target.value;
                              updateQuestion(index, { options: newOptions });
                            }}
                            placeholder={`Option ${optIndex + 1}`}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newOptions = (question.options || []).filter((_, i) => i !== optIndex);
                              updateQuestion(index, { options: newOptions });
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const newOptions = [...(question.options || []), ''];
                          updateQuestion(index, { options: newOptions });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Option
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
        
        <Button type="button" variant="outline" onClick={addQuestion} className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Add Question
        </Button>
      </div>
    </div>
  );
}
