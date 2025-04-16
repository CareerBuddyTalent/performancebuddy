
import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  employeeId: z.string({
    required_error: "Please select an employee.",
  }),
  skills: z.array(z.string()).min(1, {
    message: "Please select at least one skill.",
  }),
  description: z.string().optional(),
});

export type PlanFormValues = z.infer<typeof formSchema>;
