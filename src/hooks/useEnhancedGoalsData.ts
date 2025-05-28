
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Goal, Milestone } from '@/types';
import { useGoalsData } from './useGoalsData';

export function useEnhancedGoalsData() {
  const { user } = useSupabaseAuth();
  const { goals, isLoading: goalsLoading, error: goalsError, createGoal, updateGoal, deleteGoal } = useGoalsData();
  const [enhancedGoals, setEnhancedGoals] = useState<Goal[]>([]);
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

        // Transform and combine goals with their enhancements
        const enhanced = goals.map(goal => {
          // Transform milestones to match Milestone interface
          const milestones: Milestone[] = (milestonesData || [])
            .filter(m => m.goal_id === goal.id)
            .map(m => ({
              id: m.id,
              goalId: m.goal_id,
              title: m.title,
              status: m.status as "not_started" | "in_progress" | "completed",
              dueDate: m.due_date ? new Date(m.due_date) : new Date(),
              completedDate: undefined
            }));

          // Transform metrics to match Goal metrics interface
          const metrics = (metricsData || [])
            .filter(m => m.goal_id === goal.id)
            .map(m => ({
              name: m.name,
              target: m.target_value,
              current: m.current_value,
              unit: m.unit
            }));

          return {
            ...goal,
            milestones,
            metrics
          };
        });

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
    createGoal,
    updateGoal,
    deleteGoal
  };
}
