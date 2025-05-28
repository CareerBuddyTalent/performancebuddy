
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Goal } from '@/types';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

export const useGoalsData = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSupabaseAuth();

  useEffect(() => {
    const fetchGoals = async () => {
      setIsLoading(true);
      try {
        if (!user) {
          setError('User not available');
          setGoals([]);
          return;
        }

        const { data, error } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          setError(error.message);
        } else {
          setGoals(data || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, [user]);

  const createGoal = async (goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');

    const newGoal = {
      ...goalData,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('goals')
      .insert(newGoal)
      .select()
      .single();

    if (error) throw error;

    setGoals(prev => [data, ...prev]);
    return data;
  };

  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    const { data, error } = await supabase
      .from('goals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', goalId)
      .select()
      .single();

    if (error) throw error;

    setGoals(prev => prev.map(goal => goal.id === goalId ? data : goal));
    return data;
  };

  const deleteGoal = async (goalId: string) => {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', goalId);

    if (error) throw error;

    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  return { 
    goals, 
    isLoading, 
    error,
    createGoal,
    updateGoal,
    deleteGoal
  };
};
