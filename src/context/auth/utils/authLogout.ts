
import { supabase } from "@/integrations/supabase/client";

/**
 * Handles user logout
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
