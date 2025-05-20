
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
}

// Type for template creation/editing
export type ReviewTemplateFormData = Omit<ReviewTemplate, 'id' | 'createdBy' | 'createdAt' | 'updatedAt' | 'usageCount'>;
