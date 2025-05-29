
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LoginAttempt {
  email: string;
  attempts: number;
  lastAttempt: number;
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export function useSecureAuth() {
  const [loginAttempts, setLoginAttempts] = useState<Map<string, LoginAttempt>>(new Map());

  const isAccountLocked = useCallback((email: string): boolean => {
    const attempt = loginAttempts.get(email);
    if (!attempt) return false;
    
    const now = Date.now();
    const timeSinceLast = now - attempt.lastAttempt;
    
    if (attempt.attempts >= MAX_LOGIN_ATTEMPTS && timeSinceLast < LOCKOUT_DURATION) {
      return true;
    }
    
    // Reset attempts if lockout period has passed
    if (timeSinceLast >= LOCKOUT_DURATION) {
      setLoginAttempts(prev => {
        const newMap = new Map(prev);
        newMap.delete(email);
        return newMap;
      });
    }
    
    return false;
  }, [loginAttempts]);

  const recordFailedAttempt = useCallback((email: string) => {
    setLoginAttempts(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(email) || { email, attempts: 0, lastAttempt: 0 };
      newMap.set(email, {
        ...existing,
        attempts: existing.attempts + 1,
        lastAttempt: Date.now()
      });
      return newMap;
    });
  }, []);

  const clearFailedAttempts = useCallback((email: string) => {
    setLoginAttempts(prev => {
      const newMap = new Map(prev);
      newMap.delete(email);
      return newMap;
    });
  }, []);

  const secureLogin = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      // Check if account is locked
      if (isAccountLocked(email)) {
        toast.error("Account temporarily locked due to multiple failed attempts. Please try again later.");
        return false;
      }

      // Validate password strength
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        return false;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        recordFailedAttempt(email);
        
        // Generic error message to prevent information disclosure
        if (error.message.includes('Invalid login credentials')) {
          toast.error("Invalid email or password.");
        } else {
          toast.error("Login failed. Please try again.");
        }
        return false;
      }

      if (data.user) {
        clearFailedAttempts(email);
        
        // Log successful login (in production, this should go to a secure audit log)
        console.log(`Successful login for user: ${data.user.id} at ${new Date().toISOString()}`);
        
        return true;
      }

      return false;
    } catch (error) {
      recordFailedAttempt(email);
      toast.error("An unexpected error occurred. Please try again.");
      return false;
    }
  }, [isAccountLocked, recordFailedAttempt, clearFailedAttempts]);

  const secureSignup = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Enhanced password validation
      const passwordErrors = validatePasswordStrength(password);
      if (passwordErrors.length > 0) {
        toast.error(`Password requirements: ${passwordErrors.join(', ')}`);
        return false;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address.");
        return false;
      }

      // Sanitize inputs
      const sanitizedName = name.trim().substring(0, 100);
      const sanitizedEmail = email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          data: {
            name: sanitizedName
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error("An account with this email already exists.");
        } else {
          toast.error("Failed to create account. Please try again.");
        }
        return false;
      }

      if (data.user) {
        toast.success("Account created successfully! Please check your email to verify your account.");
        return true;
      }

      return false;
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      return false;
    }
  }, []);

  return {
    secureLogin,
    secureSignup,
    isAccountLocked
  };
}

function validatePasswordStrength(password: string): string[] {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("at least 8 characters");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("one lowercase letter");
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push("one number");
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("one special character");
  }
  
  return errors;
}
