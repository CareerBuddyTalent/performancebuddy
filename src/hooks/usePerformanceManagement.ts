
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { CalibrationSession, SuccessionPlan, CompetencyFramework, PIPWorkflow, ReviewOrchestration } from '@/types/performance-management';

// Helper functions to transform database data to application types
const transformCalibrationSession = (dbSession: any): CalibrationSession => {
  return {
    id: dbSession.id,
    name: dbSession.name,
    description: dbSession.description,
    manager_id: dbSession.manager_id,
    department: dbSession.department,
    session_date: new Date(dbSession.session_date),
    status: dbSession.status as 'scheduled' | 'in_progress' | 'completed' | 'cancelled',
    participants: dbSession.calibration_participants || [],
    rating_distribution: dbSession.rating_distribution || {},
    forced_ranking_enabled: dbSession.forced_ranking_enabled || false,
    bell_curve_settings: dbSession.bell_curve_settings || {},
    created_at: new Date(dbSession.created_at),
    updated_at: new Date(dbSession.updated_at),
    calibration_participants: dbSession.calibration_participants || []
  };
};

const transformSuccessionPlan = (dbPlan: any): SuccessionPlan => {
  return {
    id: dbPlan.id,
    position_title: dbPlan.position_title,
    department: dbPlan.department,
    current_incumbent: dbPlan.current_incumbent,
    business_criticality: dbPlan.business_criticality as 'low' | 'medium' | 'high' | 'critical',
    succession_coverage: dbPlan.succession_coverage,
    risk_level: dbPlan.risk_level as 'low' | 'medium' | 'high',
    created_by: dbPlan.created_by,
    candidates: dbPlan.succession_candidates || [],
    created_at: new Date(dbPlan.created_at),
    updated_at: new Date(dbPlan.updated_at),
    succession_candidates: dbPlan.succession_candidates || []
  };
};

const transformCompetencyFramework = (dbFramework: any): CompetencyFramework => {
  return {
    id: dbFramework.id,
    name: dbFramework.name,
    description: dbFramework.description,
    organization_level: dbFramework.organization_level as 'company' | 'department' | 'team' | 'role',
    department: dbFramework.department,
    role_family: dbFramework.role_family,
    is_active: dbFramework.is_active,
    created_by: dbFramework.created_by,
    competencies: dbFramework.framework_competencies || [],
    created_at: new Date(dbFramework.created_at),
    updated_at: new Date(dbFramework.updated_at),
    framework_competencies: dbFramework.framework_competencies || []
  };
};

const transformPIPWorkflow = (dbWorkflow: any): PIPWorkflow => {
  return {
    id: dbWorkflow.id,
    employee_id: dbWorkflow.employee_id,
    manager_id: dbWorkflow.manager_id,
    hr_partner_id: dbWorkflow.hr_partner_id,
    status: dbWorkflow.status as 'draft' | 'active' | 'paused' | 'completed' | 'cancelled',
    trigger_reason: dbWorkflow.trigger_reason,
    start_date: dbWorkflow.start_date ? new Date(dbWorkflow.start_date) : undefined,
    end_date: dbWorkflow.end_date ? new Date(dbWorkflow.end_date) : undefined,
    expected_outcomes: dbWorkflow.expected_outcomes || [],
    success_criteria: dbWorkflow.success_criteria || [],
    escalation_triggers: dbWorkflow.escalation_triggers || [],
    milestones: dbWorkflow.pip_milestones || [],
    created_at: new Date(dbWorkflow.created_at),
    updated_at: new Date(dbWorkflow.updated_at),
    pip_milestones: dbWorkflow.pip_milestones || []
  };
};

const transformReviewOrchestration = (dbOrchestration: any): ReviewOrchestration => {
  return {
    id: dbOrchestration.id,
    employee_id: dbOrchestration.employee_id,
    review_cycle_id: dbOrchestration.review_cycle_id,
    orchestrator_id: dbOrchestration.orchestrator_id,
    review_type: dbOrchestration.review_type as '360' | 'manager' | 'peer' | 'self' | 'upward',
    status: dbOrchestration.status as 'draft' | 'active' | 'paused' | 'completed' | 'cancelled',
    due_date: dbOrchestration.due_date ? new Date(dbOrchestration.due_date) : undefined,
    reviewer_selection_method: dbOrchestration.reviewer_selection_method as 'manual' | 'automatic' | 'hybrid',
    anonymity_level: dbOrchestration.anonymity_level as 'full' | 'partial' | 'none',
    weighting_scheme: dbOrchestration.weighting_scheme || {},
    assignments: dbOrchestration.review_assignments || [],
    created_at: new Date(dbOrchestration.created_at),
    updated_at: new Date(dbOrchestration.updated_at),
    review_assignments: dbOrchestration.review_assignments || []
  };
};

// Helper function to transform CalibrationSession to database format for insert
const transformCalibrationSessionToDb = (sessionData: Partial<CalibrationSession>) => {
  return {
    name: sessionData.name,
    description: sessionData.description,
    manager_id: sessionData.manager_id,
    department: sessionData.department,
    session_date: sessionData.session_date?.toISOString(),
    status: sessionData.status,
    participants: sessionData.participants ? JSON.stringify(sessionData.participants) : undefined,
    rating_distribution: sessionData.rating_distribution ? JSON.stringify(sessionData.rating_distribution) : undefined,
    forced_ranking_enabled: sessionData.forced_ranking_enabled,
    bell_curve_settings: sessionData.bell_curve_settings ? JSON.stringify(sessionData.bell_curve_settings) : undefined,
  };
};

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
      const transformedSessions = (data || []).map(transformCalibrationSession);
      setCalibrationSessions(transformedSessions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calibration sessions');
    } finally {
      setLoading(false);
    }
  };

  const createCalibrationSession = async (sessionData: Partial<CalibrationSession>) => {
    if (!user) return null;

    try {
      const dbData = transformCalibrationSessionToDb({
        ...sessionData,
        manager_id: user.id,
      });

      const { data, error } = await supabase
        .from('calibration_sessions')
        .insert(dbData)
        .select()
        .single();

      if (error) throw error;
      await fetchCalibrationSessions();
      return transformCalibrationSession(data);
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
      const transformedPlans = (data || []).map(transformSuccessionPlan);
      setSuccessionPlans(transformedPlans);
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
      const transformedFrameworks = (data || []).map(transformCompetencyFramework);
      setCompetencyFrameworks(transformedFrameworks);
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
      const transformedWorkflows = (data || []).map(transformPIPWorkflow);
      setPipWorkflows(transformedWorkflows);
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
      const transformedOrchestrations = (data || []).map(transformReviewOrchestration);
      setReviewOrchestrations(transformedOrchestrations);
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
