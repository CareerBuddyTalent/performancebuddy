import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Goal } from '@/types';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

export const useGoalsData = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSupabaseAuth();

  useEffect(() => {
    const fetchGoals = async () => {
      setLoading(true);
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
        setLoading(false);
      }
    };

    fetchGoals();
  }, [user]);

  return { goals, loading, error };
};
