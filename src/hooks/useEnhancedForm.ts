
import { useState } from 'react';
import { useDebounce, useToggle, useLocalStorage } from 'react-use';

interface UseEnhancedFormOptions {
  debounceMs?: number;
  persistKey?: string;
  initialValues?: Record<string, any>;
}

export function useEnhancedForm<T extends Record<string, any>>(
  options: UseEnhancedFormOptions = {}
) {
  const { debounceMs = 300, persistKey, initialValues = {} } = options;
  
  // Use localStorage if persistKey is provided
  const [formData, setFormData] = persistKey 
    ? useLocalStorage(persistKey, initialValues)
    : useState(initialValues);
  
  const [isSubmitting, toggleSubmitting] = useToggle(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Debounced validation
  const [debouncedFormData] = useDebounce(formData, debounceMs);
  
  const updateField = (field: keyof T, value: any) => {
    setFormData((prev: T) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  };
  
  const setFieldError = (field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field as string]: error }));
  };
  
  const clearErrors = () => {
    setErrors({});
  };
  
  const reset = () => {
    setFormData(initialValues);
    setErrors({});
  };
  
  return {
    formData: formData as T,
    debouncedFormData: debouncedFormData as T,
    errors,
    isSubmitting,
    updateField,
    setFieldError,
    clearErrors,
    reset,
    toggleSubmitting
  };
}
