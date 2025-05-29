
import { useCallback, useRef } from 'react';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
}

export function useRateLimit(config: RateLimitConfig) {
  const attemptsRef = useRef<{ timestamp: number; count: number }>({ timestamp: 0, count: 0 });
  const blockedUntilRef = useRef<number>(0);

  const isBlocked = useCallback(() => {
    return Date.now() < blockedUntilRef.current;
  }, []);

  const checkRateLimit = useCallback((identifier: string = 'default') => {
    const now = Date.now();
    
    // Check if currently blocked
    if (isBlocked()) {
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: blockedUntilRef.current,
        blocked: true,
      };
    }

    // Reset counter if window has passed
    if (now - attemptsRef.current.timestamp > config.windowMs) {
      attemptsRef.current = { timestamp: now, count: 0 };
    }

    // Check if within rate limit
    if (attemptsRef.current.count < config.maxAttempts) {
      attemptsRef.current.count++;
      return {
        allowed: true,
        remainingAttempts: config.maxAttempts - attemptsRef.current.count,
        resetTime: attemptsRef.current.timestamp + config.windowMs,
        blocked: false,
      };
    }

    // Rate limit exceeded, block if configured
    if (config.blockDurationMs) {
      blockedUntilRef.current = now + config.blockDurationMs;
    }

    return {
      allowed: false,
      remainingAttempts: 0,
      resetTime: attemptsRef.current.timestamp + config.windowMs,
      blocked: Boolean(config.blockDurationMs),
    };
  }, [config, isBlocked]);

  const reset = useCallback(() => {
    attemptsRef.current = { timestamp: 0, count: 0 };
    blockedUntilRef.current = 0;
  }, []);

  return {
    checkRateLimit,
    isBlocked,
    reset,
  };
}
