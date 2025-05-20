
export type ObjectiveStatus = 'draft' | 'active' | 'completed' | 'cancelled';
export type KeyResultType = 'number' | 'percentage' | 'currency' | 'binary';

export interface Objective {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: ObjectiveStatus;
  progress: number;
  startDate: Date;
  endDate: Date;
  alignedWith?: string; // Parent objective ID if this is aligned with another objective
  level: 'individual' | 'team' | 'department' | 'company';
  createdAt: Date;
  updatedAt: Date;
  keyResults: KeyResult[];
}

export interface KeyResult {
  id: string;
  objectiveId: string;
  title: string;
  description?: string;
  type: KeyResultType;
  currentValue: number;
  targetValue: number;
  startValue: number;
  unit?: string;
  progress: number;
  dueDate: Date;
  status: 'not_started' | 'in_progress' | 'completed';
  lastCheckin?: Date;
}

export interface OKRPeriod {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'closed';
}

export interface OKRCheckIn {
  id: string;
  keyResultId: string;
  previousValue: number;
  newValue: number;
  confidence: number; // 1-10 confidence score
  notes?: string;
  createdAt: Date;
  createdBy: string;
}
