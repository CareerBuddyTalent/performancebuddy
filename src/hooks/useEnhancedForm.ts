
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
  
  // Use localStorage if persistKey is provided, otherwise use regular useState
  const [formData, setFormData] = persistKey 
    ? useLocalStorage(persistKey, initialValues as T)
    : useState(initialValues as T);
  
  const [isSubmitting, toggleSubmitting] = useToggle(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Debounced validation
  const [debouncedFormData] = useDebounce(formData, debounceMs);
  
  const updateField = (field: keyof T, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
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
    setFormData(initialValues as T);
    setErrors({});
  };
  
  return {
    formData: formData || initialValues,
    debouncedFormData: debouncedFormData || initialValues,
    errors,
    isSubmitting,
    updateField,
    setFieldError,
    clearErrors,
    reset,
    toggleSubmitting
  };
}
