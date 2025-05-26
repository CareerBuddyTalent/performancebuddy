
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useClerkAuth } from '@/context/ClerkAuthContext';

interface SurveyData {
  title: string;
  description: string;
  status: 'draft' | 'active' | 'closed';
  start_date?: string;
  end_date?: string;
  target_audience: string;
  questions: Array<{
    text: string;
    type: 'text' | 'radio' | 'checkbox' | 'rating' | 'textarea';
    required: boolean;
    options?: string[];
  }>;
}

export function useSurveyCreation() {
  const { user } = useClerkAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          text: question.text,
          type: question.type,
          required: question.required,
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

  return {
    createSurvey,
    isSubmitting
  };
}
