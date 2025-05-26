
import { z } from 'zod';

export const reviewCycleSchema = z.object({
  name: z.string().min(3, 'Cycle name must be at least 3 characters').max(100, 'Name must be less than 100 characters'),
  type: z.enum(['weekly', 'monthly', 'quarterly', 'bi-annual', 'annual']),
  purpose: z.enum(['goal', 'feedback', 'performance']),
  status: z.enum(['draft', 'active', 'completed']).default('draft'),
  start_date: z.date({
    required_error: 'Start date is required',
    invalid_type_error: 'Invalid start date'
  }),
  end_date: z.date({
    required_error: 'End date is required',
    invalid_type_error: 'Invalid end date'
  }),
  parameters: z.array(z.object({
    name: z.string(),
    weight: z.number().min(0).max(100),
    description: z.string().optional()
  })).default([])
}).refine((data) => {
  return data.end_date > data.start_date;
}, {
  message: "End date must be after start date",
  path: ["end_date"],
});

export const cycleParameterSchema = z.object({
  name: z.string().min(1, 'Parameter name is required'),
  weight: z.number().min(0, 'Weight must be positive').max(100, 'Weight cannot exceed 100'),
  description: z.string().optional(),
  scoring_method: z.enum(['numeric', 'percentage', 'rating']).default('rating')
});

export type ReviewCycleFormData = z.infer<typeof reviewCycleSchema>;
export type CycleParameterFormData = z.infer<typeof cycleParameterSchema>;
