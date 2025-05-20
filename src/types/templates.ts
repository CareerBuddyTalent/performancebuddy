export type QuestionType = 'rating' | 'text' | 'multiple_choice' | 'skills_assessment' | 'goal_evaluation';

export type RatingScale = {
  min: number;
  max: number;
  labels?: Record<number, string>; // Optional labels for scale points
};

export type ReviewQuestion = {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  order: number;
  description?: string;
  ratingScale?: RatingScale;
  options?: string[]; // For multiple choice questions
  skillIds?: string[]; // For skills assessment questions
  goalIds?: string[]; // For goal evaluation questions
};

export type ReviewSection = {
  id: string;
  title: string;
  description?: string;
  order: number;
  questions: ReviewQuestion[];
};

export type ReviewTemplateType = '360' | 'self' | 'peer' | 'manager';

// Template metadata for extended features
export type TemplateMetadata = {
  version: number;
  anonymitySettings?: {
    isAnonymous: boolean;
    responseVisibility: "reviewer_only" | "manager_only" | "reviewee_visible" | "all_participants";
    hideIdentities: boolean;
    aggregateResults: boolean;
  };
  tags?: string[];
  sourceTemplateId?: string; // For templates created from pre-built templates
  versionHistory?: string[]; // IDs of previous versions
  usage?: {
    lastUsed?: Date;
    cycleIds?: string[];
    completionRate?: number;
  };
};

export interface ReviewTemplate {
  id: string;
  name: string;
  description?: string;
  type: ReviewTemplateType;
  sections: ReviewSection[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isDefault?: boolean;
  usageCount?: number;
  metadata?: TemplateMetadata; // Extended metadata
}

// Type for template creation/editing
export type ReviewTemplateFormData = Omit<ReviewTemplate, 'id' | 'createdBy' | 'createdAt' | 'updatedAt' | 'usageCount'>;

// Line Manager Features Types
export interface OneOnOneTemplate {
  id: string;
  name: string;
  description?: string;
  sections: OneOnOneSection[];
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface OneOnOneSection {
  id: string;
  title: string;
  prompts: string[];
  order: number;
  isAiGenerated?: boolean;
}

export interface OneOnOneMeeting {
  id: string;
  managerId: string;
  employeeId: string;
  date: Date;
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled';
  templateId?: string;
  notes?: string;
  actionItems: ActionItem[];
  previousMeetingId?: string;
  nextMeetingId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate?: Date;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt?: Date;
}

export interface Feedback {
  id: string;
  providerId: string;
  recipientId: string;
  content: string;
  type: 'praise' | 'suggestion' | 'criticism';
  visibility: 'private' | 'manager' | 'team' | 'public';
  relatedGoalId?: string;
  relatedSkillId?: string;
  status: 'draft' | 'published' | 'acknowledged';
  createdAt: Date;
  updatedAt: Date;
}

export interface PeerReviewRequest {
  id: string;
  initiatorId: string; // Manager who initiated
  revieweeId: string; // Employee being reviewed
  reviewerId: string; // Peer doing the reviewing
  templateId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'declined';
  isAnonymous: boolean;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PerformanceImprovementPlan {
  id: string;
  employeeId: string;
  managerId: string;
  hrManagerId?: string;
  status: 'draft' | 'active' | 'completed' | 'failed';
  startDate: Date;
  endDate: Date;
  objectives: PIPObjective[];
  meetings: PIPMeeting[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PIPObjective {
  id: string;
  description: string;
  successCriteria: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  comments?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PIPMeeting {
  id: string;
  date: Date;
  notes?: string;
  attendees: string[]; // user IDs
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
