
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { CalibrationSession, SuccessionPlan, CompetencyFramework, PIPWorkflow, ReviewOrchestration } from '@/types/performance-management';

export function usePerformanceManagement() {
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calibration Sessions
  const [calibrationSessions, setCalibrationSessions] = useState<CalibrationSession[]>([]);
  
  const fetchCalibrationSessions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('calibration_sessions')
        .select(`
          *,
          calibration_participants (*)
        `)
        .order('session_date', { ascending: false });

      if (error) throw error;
      setCalibrationSessions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calibration sessions');
    } finally {
      setLoading(false);
    }
  };

  const createCalibrationSession = async (sessionData: Partial<CalibrationSession>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('calibration_sessions')
        .insert({
          ...sessionData,
          manager_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      await fetchCalibrationSessions();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create calibration session');
      throw err;
    }
  };

  // Succession Plans
  const [successionPlans, setSuccessionPlans] = useState<SuccessionPlan[]>([]);
  
  const fetchSuccessionPlans = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('succession_plans')
        .select(`
          *,
          succession_candidates (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSuccessionPlans(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch succession plans');
    }
  };

  // Competency Frameworks
  const [competencyFrameworks, setCompetencyFrameworks] = useState<CompetencyFramework[]>([]);
  
  const fetchCompetencyFrameworks = async () => {
    try {
      const { data, error } = await supabase
        .from('competency_frameworks')
        .select(`
          *,
          framework_competencies (*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompetencyFrameworks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch competency frameworks');
    }
  };

  // PIP Workflows
  const [pipWorkflows, setPipWorkflows] = useState<PIPWorkflow[]>([]);
  
  const fetchPipWorkflows = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('pip_workflows')
        .select(`
          *,
          pip_milestones (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPipWorkflows(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch PIP workflows');
    }
  };

  // Review Orchestrations
  const [reviewOrchestrations, setReviewOrchestrations] = useState<ReviewOrchestration[]>([]);
  
  const fetchReviewOrchestrations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('review_orchestrations')
        .select(`
          *,
          review_assignments (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviewOrchestrations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch review orchestrations');
    }
  };

  useEffect(() => {
    if (user) {
      fetchCalibrationSessions();
      fetchSuccessionPlans();
      fetchCompetencyFrameworks();
      fetchPipWorkflows();
      fetchReviewOrchestrations();
    }
  }, [user]);

  return {
    calibrationSessions,
    successionPlans,
    competencyFrameworks,
    pipWorkflows,
    reviewOrchestrations,
    loading,
    error,
    createCalibrationSession,
    refreshData: () => {
      fetchCalibrationSessions();
      fetchSuccessionPlans();
      fetchCompetencyFrameworks();
      fetchPipWorkflows();
      fetchReviewOrchestrations();
    }
  };
}
