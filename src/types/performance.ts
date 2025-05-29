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

export interface Review {
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
