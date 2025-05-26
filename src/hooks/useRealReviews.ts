
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Review {
  id: string;
  employeeId: string;
  reviewerId: string;
  cycleId: string;
  status: string;
  overallRating: number;
  feedback: string;
  createdAt: string;
  updatedAt: string;
}

export function useRealReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        
        const { data, error: reviewsError } = await supabase
          .from('performance_reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (reviewsError) throw reviewsError;

        const transformedReviews: Review[] = (data || []).map(review => ({
          id: review.id,
          employeeId: review.employee_id,
          reviewerId: review.reviewer_id,
          cycleId: review.cycle_id,
          status: review.status,
          overallRating: review.overall_rating || 0,
          feedback: review.feedback || '',
          createdAt: review.created_at,
          updatedAt: review.updated_at,
        }));

        setReviews(transformedReviews);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching reviews:', err);
        setError(err.message);
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return {
    reviews,
    isLoading,
    error
  };
}
