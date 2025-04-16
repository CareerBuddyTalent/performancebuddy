
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PlanFormValues } from "./PlanFormSchema";

interface TitleFieldProps {
  form: UseFormReturn<PlanFormValues>;
}

export function TitleField({ form }: TitleFieldProps) {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input placeholder="Development plan title" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
