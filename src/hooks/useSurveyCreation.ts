import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Survey, SurveyQuestion } from '@/types/surveys';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

export const useSurveyCreation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useSupabaseAuth();

  const createSurvey = async (surveyData: Survey, questions: SurveyQuestion[]) => {
    setIsLoading(true);
    try {
      if (!user?.id) {
        throw new Error("User not authenticated.");
      }

      // 1. Insert survey metadata into the surveys table
      const { data: surveyResult, error: surveyError } = await supabase
        .from('surveys')
        .insert([
          {
            ...surveyData,
            user_id: user.id, // Associate survey with the logged-in user
          },
        ])
        .select()
        .single();

      if (surveyError) {
        console.error("Error creating survey:", surveyError);
        throw new Error(`Failed to create survey: ${surveyError.message}`);
      }

      if (!surveyResult) {
        throw new Error("Failed to create survey: No survey data returned.");
      }

      // 2. Insert survey questions into the survey_questions table
      const questionsToInsert = questions.map(question => ({
        ...question,
        survey_id: surveyResult.id, // Reference the newly created survey
      }));

      const { data: questionsResult, error: questionsError } = await supabase
        .from('survey_questions')
        .insert(questionsToInsert)
        .select();

      if (questionsError) {
        console.error("Error creating survey questions:", questionsError);
        // Optionally, attempt to delete the survey if questions fail to insert
        await supabase.from('surveys').delete().eq('id', surveyResult.id);
        throw new Error(`Failed to create survey questions: ${questionsError.message}`);
      }

      toast({
        title: "Survey created!",
        description: "Your survey has been successfully created.",
      });

      return { survey: surveyResult, questions: questionsResult };

    } catch (error: any) {
      console.error("Error during survey creation:", error);
      toast({
        title: "Error creating survey",
        description: error.message || "Failed to create the survey.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createSurvey, isLoading };
};
