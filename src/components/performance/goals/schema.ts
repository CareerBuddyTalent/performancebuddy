
import { z } from "zod";

export const goalFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  dueDate: z.date({ required_error: "Due date is required" }),
  level: z.enum(["individual", "team", "department", "company"]),
  status: z.enum(["not_started", "in_progress", "completed"]),
  progress: z.number().min(0).max(100),
  metricName: z.string().optional(),
  metricTarget: z.number().optional(),
  metricCurrent: z.number().optional(),
  metricUnit: z.string().optional(),
});

export type GoalFormValues = z.infer<typeof goalFormSchema>;

