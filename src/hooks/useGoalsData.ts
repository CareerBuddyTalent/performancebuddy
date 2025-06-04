
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Goal } from '@/types';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

// Helper function to transform database goal to application Goal type
const transformGoalFromDb = (dbGoal: any): Goal => {
  return {
    id: dbGoal.id,
    userId: dbGoal.user_id,
    title: dbGoal.title,
    description: dbGoal.description || '',
    dueDate: dbGoal.due_date ? new Date(dbGoal.due_date) : new Date(),
    status: dbGoal.status as 'not_started' | 'in_progress' | 'completed',
    progress: dbGoal.progress || 0,
    alignedWith: dbGoal.aligned_with,
    createdAt: new Date(dbGoal.created_at),
    updatedAt: new Date(dbGoal.updated_at),
    level: dbGoal.level as 'individual' | 'team' | 'department' | 'company'
  };
};

// Helper function to transform application Goal to database format for INSERT
const transformGoalToDbInsert = (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
  return {
    user_id: goal.userId,
    title: goal.title,
    description: goal.description,
    due_date: goal.dueDate?.toISOString(),
    status: goal.status,
    progress: goal.progress,
    aligned_with: goal.alignedWith,
    level: goal.level,
  };
};

// Helper function to transform application Goal to database format for UPDATE
const transformGoalToDbUpdate = (updates: Partial<Goal>) => {
  const dbUpdates: any = {};
  
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate?.toISOString();
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.progress !== undefined) dbUpdates.progress = updates.progress;
  if (updates.alignedWith !== undefined) dbUpdates.aligned_with = updates.alignedWith;
  if (updates.level !== undefined) dbUpdates.level = updates.level;
  
  dbUpdates.updated_at = new Date().toISOString();
  return dbUpdates;
};

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
          const transformedGoals = (data || []).map(transformGoalFromDb);
          setGoals(transformedGoals);
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

    const dbGoalData = transformGoalToDbInsert(goalData);

    const { data, error } = await supabase
      .from('goals')
      .insert(dbGoalData)
      .select()
      .single();

    if (error) throw error;

    const transformedGoal = transformGoalFromDb(data);
    setGoals(prev => [transformedGoal, ...prev]);
    return transformedGoal;
  };

  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    const dbUpdates = transformGoalToDbUpdate(updates);

    const { data, error } = await supabase
      .from('goals')
      .update(dbUpdates)
      .eq('id', goalId)
      .select()
      .single();

    if (error) throw error;

    const transformedGoal = transformGoalFromDb(data);
    setGoals(prev => prev.map(goal => goal.id === goalId ? transformedGoal : goal));
    return transformedGoal;
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
