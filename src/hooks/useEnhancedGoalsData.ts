
import { useState, useEffect } from 'react';
import { useClerkAuth } from '@/context/ClerkAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Goal } from '@/types';
import { useGoalsData } from './useGoalsData';

interface EnhancedGoal extends Goal {
  milestones?: Array<{
    id: string;
    title: string;
    status: 'not_started' | 'in_progress' | 'completed';
    due_date?: string;
  }>;
  enhancedMetrics?: Array<{
    id: string;
    name: string;
    target_value: number;
    current_value: number;
    unit: string;
  }>;
}

export function useEnhancedGoalsData() {
  const { user } = useClerkAuth();
  const { goals, isLoading: goalsLoading, error: goalsError, ...goalActions } = useGoalsData();
  const [enhancedGoals, setEnhancedGoals] = useState<EnhancedGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnhancedData = async () => {
      if (goalsLoading || !goals.length) {
        setIsLoading(goalsLoading);
        return;
      }

      try {
        setIsLoading(true);

        const goalIds = goals.map(goal => goal.id);

        // Fetch milestones for all goals
        const { data: milestonesData, error: milestonesError } = await supabase
          .from('goal_milestones')
          .select('id, goal_id, title, status, due_date')
          .in('goal_id', goalIds);

        if (milestonesError) throw milestonesError;

        // Fetch metrics for all goals
        const { data: metricsData, error: metricsError } = await supabase
          .from('goal_metrics')
          .select('id, goal_id, name, target_value, current_value, unit')
          .in('goal_id', goalIds);

        if (metricsError) throw metricsError;

        // Combine goals with their enhancements
        const enhanced = goals.map(goal => ({
          ...goal,
          milestones: milestonesData?.filter(m => m.goal_id === goal.id) || [],
          enhancedMetrics: metricsData?.filter(m => m.goal_id === goal.id) || []
        }));

        setEnhancedGoals(enhanced);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching enhanced goals data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnhancedData();
  }, [goals, goalsLoading]);

  useEffect(() => {
    if (goalsError) {
      setError(goalsError);
    }
  }, [goalsError]);

  return {
    goals: enhancedGoals,
    isLoading,
    error,
    ...goalActions
  };
}
