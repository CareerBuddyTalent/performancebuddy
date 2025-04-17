
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
  improvementPlan?: ImprovementPlan;
}
