
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GoalFormValues } from "./schema";

interface MetricsSectionProps {
  form: UseFormReturn<GoalFormValues>;
}

export default function MetricsSection({ form }: MetricsSectionProps) {
  return (
    <div className="border rounded-md p-4">
      <h3 className="text-sm font-medium mb-2">Metrics</h3>
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="metricName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Metric Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Revenue, Users, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="metricCurrent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="metricTarget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="metricUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. $, %, hrs" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
