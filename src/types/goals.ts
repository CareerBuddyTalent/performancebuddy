
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  alignedWith?: string;
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
