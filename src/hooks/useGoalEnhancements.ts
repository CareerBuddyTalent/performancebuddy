import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';

interface GoalMilestone {
  id: string;
  goal_id: string;
  title: string;
  description?: string;
  due_date?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completed_date?: string;
  created_at: string;
  updated_at: string;
}

interface GoalMetric {
  id: string;
  goal_id: string;
  name: string;
  target_value: number;
  current_value: number;
  unit: string;
  created_at: string;
  updated_at: string;
}

interface GoalIntegration {
  id: string;
  goal_id: string;
  integration_type: 'salesforce' | 'jira' | 'notion';
  entity_id: string;
  last_synced?: string;
  created_at: string;
  updated_at: string;
}

export function useGoalEnhancements(goalId?: string) {
  const { user } = useSupabaseAuth();
  const [milestones, setMilestones] = useState<GoalMilestone[]>([]);
  const [metrics, setMetrics] = useState<GoalMetric[]>([]);
  const [integrations, setIntegrations] = useState<GoalIntegration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!goalId) {
      setIsLoading(false);
      return;
    }

    const fetchGoalEnhancements = async () => {
      try {
        setIsLoading(true);

        // Fetch milestones for the goal
        const { data: milestonesData, error: milestonesError } = await supabase
          .from('goal_milestones')
          .select('*')
          .eq('goal_id', goalId)
          .order('due_date');

        if (milestonesError) throw milestonesError;
        setMilestones(milestonesData || []);

        // Fetch metrics for the goal
        const { data: metricsData, error: metricsError } = await supabase
          .from('goal_metrics')
          .select('*')
          .eq('goal_id', goalId)
          .order('name');

        if (metricsError) throw metricsError;
        setMetrics(metricsData || []);

        // Fetch integrations for the goal
        const { data: integrationsData, error: integrationsError } = await supabase
          .from('goal_integrations')
          .select('*')
          .eq('goal_id', goalId)
          .order('integration_type');

        if (integrationsError) throw integrationsError;
        setIntegrations(integrationsData || []);
      } catch (err: any) {
        console.error('Error fetching goal enhancements:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoalEnhancements();
  }, [goalId]);

  const createMilestone = async (milestoneData: Omit<GoalMilestone, 'id' | 'created_at' | 'updated_at'>) => {
    if (!goalId) return;

    try {
      const { data, error } = await supabase
        .from('goal_milestones')
        .insert({
          ...milestoneData,
          goal_id: goalId
        })
        .select()
        .single();

      if (error) throw error;

      setMilestones(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      console.error('Error creating milestone:', err);
      throw err;
    }
  };

  const updateMilestone = async (milestoneId: string, updates: Partial<GoalMilestone>) => {
    try {
      const { data, error } = await supabase
        .from('goal_milestones')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', milestoneId)
        .select()
        .single();

      if (error) throw error;

      setMilestones(prev => prev.map(milestone => 
        milestone.id === milestoneId ? data : milestone
      ));
    } catch (err: any) {
      console.error('Error updating milestone:', err);
      throw err;
    }
  };

  const createMetric = async (metricData: Omit<GoalMetric, 'id' | 'created_at' | 'updated_at'>) => {
    if (!goalId) return;

    try {
      const { data, error } = await supabase
        .from('goal_metrics')
        .insert({
          ...metricData,
          goal_id: goalId
        })
        .select()
        .single();

      if (error) throw error;

      setMetrics(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      console.error('Error creating metric:', err);
      throw err;
    }
  };

  const updateMetric = async (metricId: string, updates: Partial<GoalMetric>) => {
    try {
      const { data, error } = await supabase
        .from('goal_metrics')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', metricId)
        .select()
        .single();

      if (error) throw error;

      setMetrics(prev => prev.map(metric => 
        metric.id === metricId ? data : metric
      ));
    } catch (err: any) {
      console.error('Error updating metric:', err);
      throw err;
    }
  };

  return {
    milestones,
    metrics,
    integrations,
    isLoading,
    error,
    createMilestone,
    updateMilestone,
    createMetric,
    updateMetric
  };
}
