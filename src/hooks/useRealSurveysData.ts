
import { useState, useEffect } from 'react';
import { useClerkAuth } from '@/context/ClerkAuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface Survey {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'closed';
  creator_id: string;
  target_audience?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface SurveyQuestion {
  id: string;
  survey_id: string;
  text: string;
  type: 'text' | 'multiple_choice' | 'rating' | 'yes_no' | 'scale';
  options?: string[];
  required: boolean;
  order_index: number;
}

export function useRealSurveysData() {
  const { user } = useClerkAuth();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurveys = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        const { data, error: fetchError } = await supabase
          .from('surveys')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setSurveys(data || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching surveys:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveys();
  }, [user]);

  const createSurvey = async (surveyData: Omit<Survey, 'id' | 'created_at' | 'updated_at' | 'creator_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('surveys')
        .insert({
          ...surveyData,
          creator_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setSurveys(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Error creating survey:', err);
      throw err;
    }
  };

  const updateSurvey = async (id: string, updates: Partial<Survey>) => {
    try {
      const { data, error } = await supabase
        .from('surveys')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSurveys(prev => prev.map(survey => 
        survey.id === id ? data : survey
      ));
      return data;
    } catch (err: any) {
      console.error('Error updating survey:', err);
      throw err;
    }
  };

  const deleteSurvey = async (id: string) => {
    try {
      const { error } = await supabase
        .from('surveys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSurveys(prev => prev.filter(survey => survey.id !== id));
    } catch (err: any) {
      console.error('Error deleting survey:', err);
      throw err;
    }
  };

  const getSurveyQuestions = async (surveyId: string): Promise<SurveyQuestion[]> => {
    try {
      const { data, error } = await supabase
        .from('survey_questions')
        .select('*')
        .eq('survey_id', surveyId)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      console.error('Error fetching survey questions:', err);
      throw err;
    }
  };

  const addSurveyQuestion = async (questionData: Omit<SurveyQuestion, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('survey_questions')
        .insert(questionData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Error adding survey question:', err);
      throw err;
    }
  };

  return {
    surveys,
    isLoading,
    error,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    getSurveyQuestions,
    addSurveyQuestion
  };
}
