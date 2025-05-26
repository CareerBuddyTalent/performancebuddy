
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useClerkAuth } from '@/context/ClerkAuthContext';
import { SurveyQuestion } from '@/types';

export interface CreateSurveyForm {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  targetAudience: 'all' | 'department' | 'team';
}

interface SurveyData {
  title: string;
  description: string;
  status: 'draft' | 'active' | 'closed';
  start_date?: string;
  end_date?: string;
  target_audience: string;
  questions: Array<Partial<SurveyQuestion>>;
}

export function useSurveyCreation(onCreateSurvey?: Function, onClose?: Function) {
  const { user } = useClerkAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<Partial<SurveyQuestion>[]>([]);

  const form = useForm<CreateSurveyForm>({
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      targetAudience: 'all'
    }
  });

  const canCreateSurvey = user?.role === 'admin' || user?.role === 'manager';

  const handleAddQuestion = (question: Partial<SurveyQuestion>) => {
    const newQuestion: Partial<SurveyQuestion> = {
      ...question,
      id: crypto.randomUUID()
    };
    setQuestions([...questions, newQuestion]);
  };

  const createSurvey = async (surveyData: SurveyData) => {
    if (!user) {
      toast.error('You must be logged in to create a survey');
      return null;
    }

    setIsSubmitting(true);
    try {
      // Create the survey
      const { data: survey, error: surveyError } = await supabase
        .from('surveys')
        .insert({
          title: surveyData.title,
          description: surveyData.description,
          status: surveyData.status,
          start_date: surveyData.start_date,
          end_date: surveyData.end_date,
          target_audience: surveyData.target_audience,
          creator_id: user.id
        })
        .select()
        .single();

      if (surveyError) throw surveyError;

      // Create the questions
      if (surveyData.questions.length > 0) {
        const questionsToInsert = surveyData.questions.map((question, index) => ({
          survey_id: survey.id,
          text: question.text || '',
          type: question.type || 'text',
          required: question.required || false,
          order_index: index,
          options: question.options || null
        }));

        const { error: questionsError } = await supabase
          .from('survey_questions')
          .insert(questionsToInsert);

        if (questionsError) throw questionsError;
      }

      toast.success('Survey created successfully');
      return survey;
    } catch (error: any) {
      console.error('Error creating survey:', error);
      toast.error(error.message || 'Failed to create survey');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (data: CreateSurveyForm) => {
    const surveyData: SurveyData = {
      title: data.title,
      description: data.description,
      status: 'draft',
      start_date: data.startDate,
      end_date: data.endDate,
      target_audience: data.targetAudience,
      questions: questions
    };

    const result = await createSurvey(surveyData);
    if (result && onCreateSurvey) {
      onCreateSurvey(result);
    }
    if (result && onClose) {
      onClose();
    }
  };

  return {
    form,
    questions,
    canCreateSurvey,
    createSurvey,
    isSubmitting,
    handleSubmit,
    handleAddQuestion
  };
}
