
import { Session } from '@supabase/supabase-js';

export const calculateSessionTimeLeft = (session: Session | null): number | null => {
  if (!session) return null;
  
  const expiresAt = session.expires_at ? session.expires_at * 1000 : Date.now() + (60 * 60 * 1000);
  const timeLeft = expiresAt - Date.now();
  return Math.max(0, timeLeft);
};

export const shouldWarnAboutExpiry = (timeLeft: number | null): boolean => {
  return timeLeft !== null && timeLeft <= 5 * 60 * 1000 && timeLeft > 0;
};
