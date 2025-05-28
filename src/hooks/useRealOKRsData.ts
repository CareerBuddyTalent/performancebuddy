import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface OKR {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  type: 'objective' | 'key_result';
  parent_id?: string;
  status: 'active' | 'completed' | 'cancelled';
  level: 'individual' | 'team' | 'company';
  progress: number;
  target_value?: number;
  current_value?: number;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export function useRealOKRsData() {
  const { user } = useSupabaseAuth();
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOKRs = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        // Fetch user's OKRs or all OKRs if user has permissions
        let query = supabase.from('okrs').select('*');
        
        if (user.role === 'admin') {
          // Admin can see all OKRs
        } else if (user.role === 'manager') {
          // Manager can see team OKRs (for now, just their own)
          query = query.eq('user_id', user.id);
        } else {
          // Employee can only see their own OKRs
          query = query.eq('user_id', user.id);
        }

        const { data, error: fetchError } = await query.order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setOkrs(data || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching OKRs:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOKRs();
  }, [user]);

  const createOKR = async (okrData: Omit<OKR, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('okrs')
        .insert({
          ...okrData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setOkrs(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Error creating OKR:', err);
      throw err;
    }
  };

  const updateOKR = async (id: string, updates: Partial<OKR>) => {
    try {
      const { data, error } = await supabase
        .from('okrs')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setOkrs(prev => prev.map(okr => 
        okr.id === id ? data : okr
      ));
      return data;
    } catch (err: any) {
      console.error('Error updating OKR:', err);
      throw err;
    }
  };

  const deleteOKR = async (id: string) => {
    try {
      const { error } = await supabase
        .from('okrs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setOkrs(prev => prev.filter(okr => okr.id !== id));
    } catch (err: any) {
      console.error('Error deleting OKR:', err);
      throw err;
    }
  };

  const updateProgress = async (id: string, progress: number, current_value?: number) => {
    try {
      const updates: any = { progress };
      if (current_value !== undefined) {
        updates.current_value = current_value;
      }

      return await updateOKR(id, updates);
    } catch (err: any) {
      console.error('Error updating OKR progress:', err);
      throw err;
    }
  };

  // Helper functions
  const getObjectives = () => okrs.filter(okr => okr.type === 'objective');
  const getKeyResults = (objectiveId?: string) => 
    okrs.filter(okr => okr.type === 'key_result' && (!objectiveId || okr.parent_id === objectiveId));

  return {
    okrs,
    isLoading,
    error,
    createOKR,
    updateOKR,
    deleteOKR,
    updateProgress,
    getObjectives,
    getKeyResults
  };
}
