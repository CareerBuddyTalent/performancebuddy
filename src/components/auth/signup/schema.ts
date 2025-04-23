
import { z } from "zod";

export const signupFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(['employee', 'manager', 'admin']).optional().default('employee')
});

export type SignupFormValues = z.infer<typeof signupFormSchema>;
