
import React from 'react';
import { useForm, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

interface ValidatedFormProps<T extends z.ZodType> {
  schema: T;
  onSubmit: (data: z.infer<T>) => void | Promise<void>;
  defaultValues?: DefaultValues<z.infer<T>>;
  children: (form: any) => React.ReactNode;
  submitText?: string;
  isLoading?: boolean;
  className?: string;
}

export function ValidatedForm<T extends z.ZodType>({
  schema,
  onSubmit,
  defaultValues,
  children,
  submitText = "Submit",
  isLoading = false,
  className = "space-y-6"
}: ValidatedFormProps<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<z.infer<T>>
  });

  const handleSubmit = async (data: z.infer<T>) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
        {children(form)}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : submitText}
        </Button>
      </form>
    </Form>
  );
}
