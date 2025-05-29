
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { supabase } from '@/integrations/supabase/client';
import { Survey, SurveyQuestion } from '@/types/surveys';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

export interface CreateSurveyForm {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export const useSurveyCreation = (onCreateSurvey: (survey: Partial<Survey>) => void, onClose: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const { toast } = useToast();
  const { user } = useSupabaseAuth();

  const form = useForm<CreateSurveyForm>({
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      endDate: ''
    }
  });

  const canCreateSurvey = user?.role === 'admin' || user?.role === 'manager';

  const handleAddQuestion = (question: SurveyQuestion) => {
    setQuestions(prev => [...prev, question]);
  };

  const handleSubmit = async (data: CreateSurveyForm) => {
    setIsLoading(true);
    try {
      if (!user?.id) {
        throw new Error("User not authenticated.");
      }

      const surveyData: Partial<Survey> = {
        title: data.title,
        description: data.description,
        start_date: new Date(data.startDate),
        end_date: new Date(data.endDate),
        status: 'draft',
        questions,
        responses: [],
        creator_id: user.id
      };

      onCreateSurvey(surveyData);
      onClose();

      toast({
        title: "Survey created!",
        description: "Your survey has been successfully created.",
      });

    } catch (error: any) {
      console.error("Error during survey creation:", error);
      toast({
        title: "Error creating survey",
        description: error.message || "Failed to create the survey.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    form,
    questions,
    canCreateSurvey,
    handleSubmit,
    handleAddQuestion,
    isLoading
  };
};
