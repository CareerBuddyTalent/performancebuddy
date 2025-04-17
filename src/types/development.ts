
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
    attendees: string[];
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
