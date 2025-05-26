
import { z } from 'zod';

export const goalSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().optional(),
  level: z.enum(['individual', 'team', 'company']),
  status: z.enum(['not_started', 'in_progress', 'completed']).default('not_started'),
  progress: z.number().min(0).max(100).default(0),
  dueDate: z.date().optional(),
});

export const milestoneSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  dueDate: z.date(),
  status: z.enum(['not_started', 'in_progress', 'completed']).default('not_started'),
});

export const metricSchema = z.object({
  name: z.string().min(2, 'Metric name must be at least 2 characters'),
  unit: z.string().min(1, 'Unit is required'),
  target: z.number().min(0, 'Target must be positive'),
  current: z.number().min(0, 'Current value must be positive').default(0),
});

export type GoalFormData = z.infer<typeof goalSchema>;
export type MilestoneFormData = z.infer<typeof milestoneSchema>;
export type MetricFormData = z.infer<typeof metricSchema>;
