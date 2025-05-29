
import { useCallback } from 'react';

export function useSecureInput() {
  const sanitizeText = useCallback((input: string): string => {
    if (!input) return '';
    
    // Remove potentially dangerous characters and limit length
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim()
      .substring(0, 1000);
  }, []);

  const sanitizeEmail = useCallback((email: string): string => {
    if (!email) return '';
    
    return email
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9@._-]/g, '')
      .substring(0, 254);
  }, []);

  const sanitizeNumber = useCallback((input: string | number): number | null => {
    if (typeof input === 'number') {
      return isNaN(input) ? null : input;
    }
    
    const parsed = parseFloat(String(input).replace(/[^0-9.-]/g, ''));
    return isNaN(parsed) ? null : parsed;
  }, []);

  const validateRequired = useCallback((value: string, fieldName: string): string | null => {
    if (!value || value.trim().length === 0) {
      return `${fieldName} is required`;
    }
    return null;
  }, []);

  const validateEmail = useCallback((email: string): string | null => {
    if (!email) return 'Email is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    if (email.length > 254) {
      return 'Email address is too long';
    }
    
    return null;
  }, []);

  const validateTextLength = useCallback((text: string, minLength: number, maxLength: number, fieldName: string): string | null => {
    if (text.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters`;
    }
    
    if (text.length > maxLength) {
      return `${fieldName} must be no more than ${maxLength} characters`;
    }
    
    return null;
  }, []);

  return {
    sanitizeText,
    sanitizeEmail,
    sanitizeNumber,
    validateRequired,
    validateEmail,
    validateTextLength
  };
}
