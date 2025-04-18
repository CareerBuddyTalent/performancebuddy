
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SurveyQuestion } from '@/types';

interface AddQuestionFormProps {
  onAddQuestion: (question: Partial<SurveyQuestion>) => void;
  orderIndex: number;
}

export default function AddQuestionForm({ onAddQuestion, orderIndex }: AddQuestionFormProps) {
  const [text, setText] = useState('');
  const [type, setType] = useState<'multiple_choice' | 'text' | 'rating'>('text');
  const [required, setRequired] = useState(true);
  const [options, setOptions] = useState<string[]>(['']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddQuestion({
      text,
      type,
      required,
      options: type === 'multiple_choice' ? options.filter(o => o.trim() !== '') : undefined,
      order_index: orderIndex
    });
    setText('');
    setType('text');
    setRequired(true);
    setOptions(['']);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="question-text">Question Text</Label>
        <Input
          id="question-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your question"
          required
        />
      </div>

      <div>
        <Label htmlFor="question-type">Question Type</Label>
        <Select value={type} onValueChange={(value: any) => setType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select question type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {type === 'multiple_choice' && (
        <div className="space-y-2">
          <Label>Options</Label>
          {options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
                placeholder={`Option ${index + 1}`}
              />
              {index === options.length - 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOptions([...options, ''])}
                >
                  Add Option
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Checkbox
          id="required"
          checked={required}
          onCheckedChange={(checked) => setRequired(checked as boolean)}
        />
        <Label htmlFor="required">Required</Label>
      </div>

      <Button type="submit">Add Question</Button>
    </form>
  );
}
