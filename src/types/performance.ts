
import { ImprovementPlan } from './development';

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
  parameters: ReviewParameter[]; // Updated from string[] to ReviewParameter[]
  type: 'weekly' | 'monthly' | 'quarterly' | 'bi-annual' | 'annual';
  purpose: 'goal' | 'feedback' | 'performance';
  weightings?: {
    [key: string]: number; // Category to weighting mapping (adds up to 100)
  };
}

export interface ReviewParameter {
  id: string;
  name: string;
  description?: string;
  category: 'technical' | 'soft' | 'performance' | 'goals' | 'custom';
  required: boolean;
  maxScore: number; // typically 5 or 10
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
  improvementPlan?: ImprovementPlan;
}
