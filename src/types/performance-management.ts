
// Core types for advanced performance management
export interface CalibrationSession {
  id: string;
  name: string;
  description?: string;
  manager_id: string;
  department?: string;
  session_date: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  participants: CalibrationParticipant[];
  rating_distribution: Record<string, number>;
  forced_ranking_enabled: boolean;
  bell_curve_settings: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface CalibrationParticipant {
  id: string;
  session_id: string;
  employee_id: string;
  current_rating?: number;
  calibrated_rating?: number;
  justification?: string;
  created_at: Date;
}

export interface SuccessionPlan {
  id: string;
  position_title: string;
  department?: string;
  current_incumbent?: string;
  business_criticality: 'low' | 'medium' | 'high' | 'critical';
  succession_coverage: number;
  risk_level: 'low' | 'medium' | 'high';
  created_by: string;
  candidates?: SuccessionCandidate[];
  created_at: Date;
  updated_at: Date;
}

export interface SuccessionCandidate {
  id: string;
  succession_plan_id: string;
  candidate_id: string;
  readiness_level: 'not_ready' | 'emerging' | 'ready_now' | 'ready_plus';
  readiness_timeline?: string;
  development_needs: string[];
  strengths: string[];
  risk_factors: string[];
  development_plan_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CompetencyFramework {
  id: string;
  name: string;
  description?: string;
  organization_level: 'company' | 'department' | 'team' | 'role';
  department?: string;
  role_family?: string;
  is_active: boolean;
  created_by: string;
  competencies?: FrameworkCompetency[];
  created_at: Date;
  updated_at: Date;
}

export interface FrameworkCompetency {
  id: string;
  framework_id: string;
  competency_name: string;
  description?: string;
  category?: string;
  weight_percentage: number;
  behavioral_indicators: Record<string, string[]>;
  level_definitions: Record<string, string>;
  created_at: Date;
}

export interface CompetencyAssessment {
  id: string;
  employee_id: string;
  framework_id: string;
  competency_id: string;
  assessor_id: string;
  current_level?: 'novice' | 'developing' | 'proficient' | 'advanced' | 'expert';
  target_level?: 'novice' | 'developing' | 'proficient' | 'advanced' | 'expert';
  assessment_date: Date;
  evidence?: string;
  development_actions: string[];
  next_review_date?: Date;
  created_at: Date;
}

export interface PIPWorkflow {
  id: string;
  employee_id: string;
  manager_id: string;
  hr_partner_id?: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  trigger_reason: string;
  start_date?: Date;
  end_date?: Date;
  expected_outcomes: string[];
  success_criteria: string[];
  escalation_triggers: string[];
  milestones?: PIPMilestone[];
  created_at: Date;
  updated_at: Date;
}

export interface PIPMilestone {
  id: string;
  pip_workflow_id: string;
  title: string;
  description?: string;
  due_date?: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  completion_date?: Date;
  evidence_required?: string;
  evidence_submitted?: string;
  manager_notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ReviewOrchestration {
  id: string;
  employee_id: string;
  review_cycle_id?: string;
  orchestrator_id: string;
  review_type: '360' | 'manager' | 'peer' | 'self' | 'upward';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  due_date?: Date;
  reviewer_selection_method: 'manual' | 'automatic' | 'hybrid';
  anonymity_level: 'full' | 'partial' | 'none';
  weighting_scheme: Record<string, number>;
  assignments?: ReviewAssignment[];
  created_at: Date;
  updated_at: Date;
}

export interface ReviewAssignment {
  id: string;
  orchestration_id: string;
  reviewer_id: string;
  reviewer_type: 'self' | 'manager' | 'peer' | 'direct_report' | 'other';
  invitation_sent_at?: Date;
  reminder_count: number;
  last_reminder_at?: Date;
  submitted_at?: Date;
  review_data: Record<string, any>;
  status: 'pending' | 'in_progress' | 'completed' | 'declined';
  created_at: Date;
}

export interface WorkflowNotification {
  id: string;
  workflow_type: string;
  workflow_id: string;
  recipient_id: string;
  notification_type: string;
  message?: string;
  sent_at?: Date;
  read_at?: Date;
  action_required: boolean;
  action_url?: string;
  created_at: Date;
}

export interface PerformanceAnalytic {
  id: string;
  entity_type: 'individual' | 'team' | 'department' | 'organization';
  entity_id: string;
  metric_name: string;
  metric_value?: number;
  period_start?: Date;
  period_end?: Date;
  benchmark_value?: number;
  percentile_ranking?: number;
  trend_direction?: 'up' | 'down' | 'stable';
  metadata: Record<string, any>;
  created_at: Date;
}
