export type UserRole = 'employee' | 'manager' | 'admin';

export interface Company {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
  department?: string;
  position?: string;
  manager?: string;
  skills?: string[]; // IDs of skills the user has
  competencyLevel?: Record<string, number>; // Skill ID to level (1-5) mapping
  companyId?: string; // Reference to the company
  company?: Company; // Company object
}

export interface PerformanceParameter {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface ReviewCycle {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'completed';
  parameters: string[]; // ids of parameters
  type: 'weekly' | 'monthly' | 'quarterly' | 'bi-annual' | 'annual';
  purpose: 'goal' | 'feedback' | 'performance';
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  cycleId: string;
  status: 'not_started' | 'in_progress' | 'submitted' | 'acknowledged';
  ratings: {
    parameterId: string;
    score: number;
    comment: string;
  }[];
  overallRating: number;
  feedback: string;
  createdAt: Date;
  updatedAt: Date;
  improvementPlan?: ImprovementPlan; // Optional improvement plan
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number; // 0-100
  alignedWith?: string; // department or company goal
  createdAt: Date;
  updatedAt: Date;
  integrations?: {
    type: 'salesforce' | 'jira' | 'notion';
    entityId: string;
    lastSynced?: Date;
  }[];
  milestones?: Milestone[];
  level: 'individual' | 'team' | 'department' | 'company';
  metrics?: {
    name: string;
    target: number;
    current: number;
    unit: string;
  }[];
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  dueDate: Date;
  status: 'not_started' | 'in_progress' | 'completed';
  completedDate?: Date;
}

export interface Feedback {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  type: 'praise' | 'suggestion' | 'criticism';
  isAnonymous: boolean;
  createdAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string; // Technical, Soft skill, Leadership, etc.
  levels: SkillLevel[];
}

export interface SkillLevel {
  level: number; // 1-5
  description: string;
  expectations: string[];
  examples?: string[];
}

export interface ImprovementPlan {
  id: string;
  reviewId: string;
  employeeId: string;
  managerId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'failed';
  objectives: {
    id: string;
    description: string;
    success_criteria: string;
    status: 'not_started' | 'in_progress' | 'completed';
  }[];
  meetings: {
    id: string;
    date: Date;
    notes: string;
    attendees: string[]; // User IDs
  }[];
}

export interface DevelopmentPlan {
  id: string;
  employeeId: string;
  title: string;
  skills: string[];
  description?: string;
  objectives: {
    id: string;
    description: string;
    dueDate: Date;
    status: "not_started" | "in_progress" | "completed";
  }[];
  createdAt: Date;
  modifiedAt: Date;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  targetAudience: 'all' | 'department' | 'team';
  audienceIds?: string[]; // Department or team IDs
  status: 'draft' | 'active' | 'closed';
  startDate: Date;
  endDate: Date;
  responses: SurveyResponse[];
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'rating' | 'multiple_choice' | 'text';
  options?: string[]; // For multiple choice
  required: boolean;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  userId: string;
  answers: {
    questionId: string;
    answer: string | number;
  }[];
  submittedAt: Date;
}
