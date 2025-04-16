
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { PlanFormValues } from "./PlanFormSchema";

interface EmployeeFieldProps {
  form: UseFormReturn<PlanFormValues>;
  employees: { id: string; name: string }[];
}

export function EmployeeField({ form, employees }: EmployeeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="employeeId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Employee</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {employees.map(employee => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
