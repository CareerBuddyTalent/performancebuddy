
import { z } from 'zod';

export const userProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  department: z.string().optional(),
  position: z.string().optional(),
  manager: z.string().optional(),
  role: z.enum(['employee', 'manager', 'admin']).default('employee'),
});

export const userRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  department: z.string().optional(),
  position: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const skillAssessmentSchema = z.object({
  skill_id: z.string().min(1, 'Skill is required'),
  competency_level: z.number().min(1).max(5),
  assessment_type: z.enum(['self', 'peer', 'manager']),
  notes: z.string().optional(),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type UserRegistrationFormData = z.infer<typeof userRegistrationSchema>;
export type SkillAssessmentFormData = z.infer<typeof skillAssessmentSchema>;
