
import * as z from "zod";

export const okrFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  startDate: z.date(),
  dueDate: z.date().refine(
    (date) => date > new Date(), 
    { message: "Due date must be in the future" }
  ),
  level: z.enum(["individual", "team", "department", "company"])
});

export type OKRFormValues = z.infer<typeof okrFormSchema>;
