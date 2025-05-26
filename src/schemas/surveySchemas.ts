
import { z } from 'zod';

export const surveySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  status: z.enum(['draft', 'active', 'closed']).default('draft'),
  target_audience: z.enum(['all', 'managers', 'employees', 'admins']).default('all'),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
}).refine((data) => {
  if (data.start_date && data.end_date) {
    return data.end_date > data.start_date;
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["end_date"],
});

export const surveyQuestionSchema = z.object({
  text: z.string().min(5, 'Question must be at least 5 characters'),
  type: z.enum(['text', 'multiple_choice', 'rating', 'yes_no', 'scale']),
  options: z.array(z.string()).optional(),
  required: z.boolean().default(true),
  order_index: z.number().min(0),
}).refine((data) => {
  if (data.type === 'multiple_choice' && (!data.options || data.options.length < 2)) {
    return false;
  }
  return true;
}, {
  message: "Multiple choice questions must have at least 2 options",
  path: ["options"],
});

export type SurveyFormData = z.infer<typeof surveySchema>;
export type SurveyQuestionFormData = z.infer<typeof surveyQuestionSchema>;
