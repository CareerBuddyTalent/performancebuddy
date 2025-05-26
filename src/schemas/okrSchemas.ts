
import { z } from 'zod';

export const okrSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(150, 'Title must be less than 150 characters'),
  description: z.string().optional(),
  type: z.enum(['objective', 'key_result']),
  level: z.enum(['individual', 'team', 'company']).default('individual'),
  status: z.enum(['active', 'completed', 'cancelled']).default('active'),
  progress: z.number().min(0).max(100).default(0),
  target_value: z.number().optional(),
  current_value: z.number().optional(),
  due_date: z.date().optional(),
  parent_id: z.string().optional(),
}).refine((data) => {
  if (data.type === 'key_result' && !data.parent_id) {
    return false;
  }
  return true;
}, {
  message: "Key results must have a parent objective",
  path: ["parent_id"],
});

export const progressUpdateSchema = z.object({
  progress: z.number().min(0).max(100),
  current_value: z.number().optional(),
  notes: z.string().optional(),
});

export type OKRFormData = z.infer<typeof okrSchema>;
export type ProgressUpdateFormData = z.infer<typeof progressUpdateSchema>;
