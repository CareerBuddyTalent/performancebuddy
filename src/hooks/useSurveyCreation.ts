
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Survey, SurveyQuestion } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export interface CreateSurveyForm {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export function useSurveyCreation(onCreateSurvey: (survey: Partial<Survey>) => void, onClose: () => void) {
  const [questions, setQuestions] = useState<Partial<SurveyQuestion>[]>([]);
  const { user } = useAuth();
  const form = useForm<CreateSurveyForm>();

  const canCreateSurvey = user?.role === 'admin' || user?.role === 'manager';

  const handleSubmit = async (data: CreateSurveyForm) => {
    if (!canCreateSurvey) {
      toast.error("You don't have permission to create surveys");
      return;
    }

    if (questions.length === 0) {
      toast.error("Please add at least one question to the survey.");
      return;
    }

    try {
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
          survey_id: '',
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

  return {
    form,
    questions,
    canCreateSurvey,
    handleSubmit,
    handleAddQuestion
  };
}
