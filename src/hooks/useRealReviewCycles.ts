import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ReviewCycle {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  type: string;
  purpose: string;
  parameters: any[];
}

export function useRealReviewCycles() {
  const { user } = useSupabaseAuth();
  const [reviewCycles, setReviewCycles] = useState<ReviewCycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviewCycles = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        const { data, error: fetchError } = await supabase
          .from('review_cycles')
          .select('*')
          .order('start_date', { ascending: false });

        if (fetchError) throw fetchError;

        setReviewCycles(data || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching review cycles:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewCycles();
  }, [user]);

  const createReviewCycle = async (cycleData: Omit<ReviewCycle, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('review_cycles')
        .insert(cycleData)
        .select()
        .single();

      if (error) throw error;

      setReviewCycles(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Error creating review cycle:', err);
      throw err;
    }
  };

  return {
    reviewCycles,
    isLoading,
    error,
    createReviewCycle
  };
}
