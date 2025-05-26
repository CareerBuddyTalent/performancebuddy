import { useState, useEffect } from 'react';
import { useClerkAuth } from '@/context/ClerkAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Goal } from '@/types';

export function useGoalsData() {
  const { user } = useClerkAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchGoals = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedGoals: Goal[] = data?.map(goal => ({
          id: goal.id,
          userId: goal.user_id,
          title: goal.title,
          description: goal.description || '',
          dueDate: goal.due_date ? new Date(goal.due_date) : undefined,
          status: goal.status as "not_started" | "in_progress" | "completed",
          progress: goal.progress || 0,
          createdAt: new Date(goal.created_at),
          updatedAt: new Date(goal.updated_at),
          level: goal.level as "individual" | "team" | "company",
          metrics: [] // Will be populated by enhanced goals hook
        })) || [];

        setGoals(formattedGoals);
      } catch (err: any) {
        console.error('Error fetching goals:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, [user]);

  const createGoal = async (goalData: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id, // Explicitly set user_id here
          title: goalData.title,
          description: goalData.description,
          due_date: goalData.dueDate?.toISOString(),
          status: goalData.status,
          progress: goalData.progress,
          level: goalData.level
        })
        .select()
        .single();

      if (error) throw error;

      const newGoal: Goal = {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        description: data.description || '',
        dueDate: data.due_date ? new Date(data.due_date) : undefined,
        status: data.status as "not_started" | "in_progress" | "completed",
        progress: data.progress || 0,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        level: data.level as "individual" | "team" | "company",
        metrics: []
      };

      setGoals(prev => [newGoal, ...prev]);
      return newGoal;
    } catch (err: any) {
      console.error('Error creating goal:', err);
      throw err;
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .update({
          title: updates.title,
          description: updates.description,
          due_date: updates.dueDate?.toISOString(),
          status: updates.status,
          progress: updates.progress,
          level: updates.level,
          updated_at: new Date().toISOString()
        })
        .eq('id', goalId)
        .select()
        .single();

      if (error) throw error;

      setGoals(prev => prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, ...updates, updatedAt: new Date() }
          : goal
      ));
    } catch (err: any) {
      console.error('Error updating goal:', err);
      throw err;
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      // Delete related milestones and metrics first (handled by CASCADE)
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;

      setGoals(prev => prev.filter(goal => goal.id !== goalId));
    } catch (err: any) {
      console.error('Error deleting goal:', err);
      throw err;
    }
  };

  return {
    goals,
    isLoading,
    error,
    createGoal,
    updateGoal,
    deleteGoal
  };
}
