
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PerformanceTrend {
  id: string;
  user_id: string;
  period_start: string;
  period_end: string;
  overall_score?: number;
  skill_scores: any;
  goal_completion_rate?: number;
  feedback_sentiment?: number;
  created_at: string;
}

interface PerformanceBenchmark {
  id: string;
  category: string;
  role_level?: string;
  department?: string;
  metric_name: string;
  benchmark_value: number;
  percentile?: number;
  created_at: string;
  updated_at: string;
}

interface SkillAssessment {
  id: string;
  user_id: string;
  skill_id: string;
  assessor_id: string;
  competency_level: number;
  assessment_type: 'self' | 'peer' | 'manager' | 'external';
  notes?: string;
  assessment_date: string;
  created_at: string;
}

// Helper function to normalize assessment_type
const normalizeAssessmentType = (type: string): 'self' | 'peer' | 'manager' | 'external' => {
  if (type === 'self' || type === 'peer' || type === 'manager' || type === 'external') {
    return type;
  }
  return 'self'; // default fallback
};

export function usePerformanceAnalytics() {
  const { user } = useSupabaseAuth();
  const [trends, setTrends] = useState<PerformanceTrend[]>([]);
  const [benchmarks, setBenchmarks] = useState<PerformanceBenchmark[]>([]);
  const [skillAssessments, setSkillAssessments] = useState<SkillAssessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);

        // Fetch performance trends for current user
        if (user) {
          const { data: trendsData, error: trendsError } = await supabase
            .from('performance_trends')
            .select('*')
            .eq('user_id', user.id)
            .order('period_start', { ascending: false });

          if (trendsError) throw trendsError;
          setTrends(trendsData || []);
        }

        // Fetch benchmarks (available to all authenticated users)
        const { data: benchmarksData, error: benchmarksError } = await supabase
          .from('performance_benchmarks')
          .select('*')
          .order('category');

        if (benchmarksError) throw benchmarksError;
        setBenchmarks(benchmarksData || []);

        // Fetch skill assessments
        if (user) {
          const { data: assessmentsData, error: assessmentsError } = await supabase
            .from('skill_assessments')
            .select('*')
            .or(`user_id.eq.${user.id},assessor_id.eq.${user.id}`)
            .order('assessment_date', { ascending: false });

          if (assessmentsError) throw assessmentsError;
          
          // Transform and normalize the data
          const normalizedAssessments: SkillAssessment[] = (assessmentsData || []).map(assessment => ({
            ...assessment,
            assessment_type: normalizeAssessmentType(assessment.assessment_type)
          }));
          setSkillAssessments(normalizedAssessments);
        }
      } catch (err: any) {
        console.error('Error fetching analytics data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [user]);

  const createSkillAssessment = async (assessmentData: Omit<SkillAssessment, 'id' | 'created_at' | 'assessment_date'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('skill_assessments')
        .insert({
          ...assessmentData,
          assessor_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const normalizedData: SkillAssessment = {
        ...data,
        assessment_type: normalizeAssessmentType(data.assessment_type)
      };

      setSkillAssessments(prev => [normalizedData, ...prev]);
      return normalizedData;
    } catch (err: any) {
      console.error('Error creating skill assessment:', err);
      throw err;
    }
  };

  const updatePerformanceTrend = async (userId: string, trendData: Omit<PerformanceTrend, 'id' | 'created_at' | 'user_id'>) => {
    try {
      const { data, error } = await supabase
        .from('performance_trends')
        .upsert({
          ...trendData,
          user_id: userId
        })
        .select()
        .single();

      if (error) throw error;

      setTrends(prev => {
        const existing = prev.find(t => t.user_id === userId && t.period_start === trendData.period_start);
        if (existing) {
          return prev.map(t => t.id === existing.id ? data : t);
        } else {
          return [data, ...prev];
        }
      });
      return data;
    } catch (err: any) {
      console.error('Error updating performance trend:', err);
      throw err;
    }
  };

  return {
    trends,
    benchmarks,
    skillAssessments,
    isLoading,
    error,
    createSkillAssessment,
    updatePerformanceTrend
  };
}
