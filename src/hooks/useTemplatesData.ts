import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ReviewTemplate {
  id: string;
  name: string;
  description?: string;
  type: '360' | 'self' | 'peer' | 'manager';
  created_by: string;
  is_active: boolean;
  is_default: boolean;
  usage_count: number;
  metadata: any;
  created_at: string;
  updated_at: string;
}

interface TemplateSection {
  id: string;
  template_id: string;
  title: string;
  description?: string;
  order_position: number;
  created_at: string;
}

interface TemplateQuestion {
  id: string;
  section_id: string;
  text: string;
  type: 'rating' | 'text' | 'multiple_choice' | 'skills_assessment' | 'goal_evaluation';
  required: boolean;
  order_position: number;
  description?: string;
  rating_scale?: any;
  options?: string[];
  skill_ids?: string[];
  goal_ids?: string[];
  created_at: string;
}

export function useTemplatesData() {
  const { user } = useSupabaseAuth();
  const [templates, setTemplates] = useState<ReviewTemplate[]>([]);
  const [sections, setSections] = useState<TemplateSection[]>([]);
  const [questions, setQuestions] = useState<TemplateQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplatesData = async () => {
      try {
        setIsLoading(true);

        // Fetch all active templates
        const { data: templatesData, error: templatesError } = await supabase
          .from('review_templates')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (templatesError) throw templatesError;

        setTemplates(templatesData || []);

        // Fetch sections for templates
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('template_sections')
          .select('*')
          .order('order_position');

        if (sectionsError) throw sectionsError;

        setSections(sectionsData || []);

        // Fetch questions for sections
        const { data: questionsData, error: questionsError } = await supabase
          .from('template_questions')
          .select('*')
          .order('order_position');

        if (questionsError) throw questionsError;

        setQuestions(questionsData || []);
      } catch (err: any) {
        console.error('Error fetching templates data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplatesData();
  }, [user]);

  const createTemplate = async (templateData: Omit<ReviewTemplate, 'id' | 'created_at' | 'updated_at' | 'usage_count'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('review_templates')
        .insert({
          ...templateData,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setTemplates(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      console.error('Error creating template:', err);
      throw err;
    }
  };

  const updateTemplate = async (templateId: string, updates: Partial<ReviewTemplate>) => {
    try {
      const { data, error } = await supabase
        .from('review_templates')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', templateId)
        .select()
        .single();

      if (error) throw error;

      setTemplates(prev => prev.map(template => 
        template.id === templateId ? data : template
      ));
    } catch (err: any) {
      console.error('Error updating template:', err);
      throw err;
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      const { error } = await supabase
        .from('review_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;

      setTemplates(prev => prev.filter(template => template.id !== templateId));
    } catch (err: any) {
      console.error('Error deleting template:', err);
      throw err;
    }
  };

  return {
    templates,
    sections,
    questions,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate
  };
}
