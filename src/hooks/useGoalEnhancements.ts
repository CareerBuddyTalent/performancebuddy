
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

// Helper function to ensure status is a valid value
const normalizeStatus = (status: string): 'not_started' | 'in_progress' | 'completed' => {
  if (status === 'not_started' || status === 'in_progress' || status === 'completed') {
    return status;
  }
  return 'not_started'; // default fallback
};

// Helper function to ensure integration_type is valid
const normalizeIntegrationType = (type: string): 'salesforce' | 'jira' | 'notion' => {
  if (type === 'salesforce' || type === 'jira' || type === 'notion') {
    return type;
  }
  return 'jira'; // default fallback
};

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
        
        // Transform and normalize the data
        const normalizedMilestones: GoalMilestone[] = (milestonesData || []).map(milestone => ({
          ...milestone,
          status: normalizeStatus(milestone.status)
        }));
        setMilestones(normalizedMilestones);

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
        
        // Transform and normalize the data
        const normalizedIntegrations: GoalIntegration[] = (integrationsData || []).map(integration => ({
          ...integration,
          integration_type: normalizeIntegrationType(integration.integration_type)
        }));
        setIntegrations(normalizedIntegrations);
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

      const normalizedData: GoalMilestone = {
        ...data,
        status: normalizeStatus(data.status)
      };

      setMilestones(prev => [...prev, normalizedData]);
      return normalizedData;
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

      const normalizedData: GoalMilestone = {
        ...data,
        status: normalizeStatus(data.status)
      };

      setMilestones(prev => prev.map(milestone => 
        milestone.id === milestoneId ? normalizedData : milestone
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
