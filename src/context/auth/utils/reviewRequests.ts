
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

/**
 * Requests a performance review from a manager
 */
export const requestReview = async (
  userId: string,
  managerId: string, 
  comments?: string
): Promise<boolean> => {
  try {
    if (!userId) return false;
    
    // In production, we would create a DB record here
    const { error } = await supabase
      .from('review_requests')
      .insert({
        id: uuidv4(),
        employee_id: userId,
        manager_id: managerId,
        comments: comments || '',
        status: 'pending',
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error requesting review:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting review:', error);
    return false;
  }
};
