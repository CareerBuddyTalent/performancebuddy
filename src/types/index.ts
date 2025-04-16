
export type UserRole = 'employee' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
  department?: string;
  position?: string;
  manager?: string;
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
