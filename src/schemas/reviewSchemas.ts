
import { z } from 'zod';

export const reviewSchema = z.object({
  employee_id: z.string().min(1, 'Employee is required'),
  reviewer_id: z.string().min(1, 'Reviewer is required'),
  cycle_id: z.string().min(1, 'Review cycle is required'),
  status: z.enum(['draft', 'in_progress', 'completed', 'pending']).default('draft'),
  feedback: z.string().optional(),
  overall_rating: z.number().min(1).max(5).optional(),
  ratings: z.array(z.object({
    skill_id: z.string(),
    rating: z.number().min(1).max(5),
    comments: z.string().optional()
  })).default([])
});

export const selfReviewSchema = z.object({
  achievements: z.string().min(10, 'Please describe your achievements (minimum 10 characters)'),
  challenges: z.string().min(10, 'Please describe challenges faced (minimum 10 characters)'),
  goals_next_period: z.string().min(10, 'Please describe your goals for next period (minimum 10 characters)'),
  skill_ratings: z.array(z.object({
    skill_id: z.string(),
    self_rating: z.number().min(1).max(5),
    notes: z.string().optional()
  })).default([]),
  overall_satisfaction: z.number().min(1).max(5).optional()
});

export const feedbackSchema = z.object({
  recipient_id: z.string().min(1, 'Recipient is required'),
  content: z.string().min(10, 'Feedback must be at least 10 characters'),
  type: z.enum(['positive', 'constructive', 'general']).default('general'),
  is_anonymous: z.boolean().default(false),
  tags: z.array(z.string()).default([])
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
export type SelfReviewFormData = z.infer<typeof selfReviewSchema>;
export type FeedbackFormData = z.infer<typeof feedbackSchema>;
