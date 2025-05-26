
import { useState, useEffect } from 'react';
import { useClerkAuth } from '@/context/ClerkAuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PerformanceReview {
  id: string;
  employee_id: string;
  reviewer_id: string;
  review_type: string;
  status: string;
  overall_score?: number;
  strengths?: string;
  areas_for_improvement?: string;
  goals_for_next_period?: string;
  manager_comments?: string;
  created_at: string;
  updated_at: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  position?: string;
  profile_picture?: string;
  manager?: string;
}

export function useRealPerformanceData() {
  const { user } = useClerkAuth();
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        // Fetch performance reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('performance_reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (reviewsError) throw reviewsError;

        // Fetch team members based on user role
        let teamQuery = supabase
          .from('profiles')
          .select(`
            id,
            name,
            email,
            department,
            position,
            profile_picture,
            manager,
            user_roles!inner(role)
          `);

        // If user is a manager, get their direct reports
        if (user.role === 'manager') {
          teamQuery = teamQuery.eq('manager', user.id);
        }
        // If user is admin, get all users
        else if (user.role !== 'admin') {
          // For regular employees, get team members in same department
          teamQuery = teamQuery.eq('department', user.department || '');
        }

        const { data: teamData, error: teamError } = await teamQuery;

        if (teamError) throw teamError;

        // Transform team data - fix the role access issue
        const transformedTeam: TeamMember[] = (teamData || []).map(member => ({
          id: member.id,
          name: member.name || member.email.split('@')[0],
          email: member.email,
          role: Array.isArray(member.user_roles) && member.user_roles.length > 0 
            ? member.user_roles[0].role 
            : 'employee',
          department: member.department,
          position: member.position,
          profile_picture: member.profile_picture,
          manager: member.manager
        }));

        setReviews(reviewsData || []);
        setTeamMembers(transformedTeam);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching performance data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerformanceData();
  }, [user]);

  const createReview = async (reviewData: Omit<PerformanceReview, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('performance_reviews')
        .insert({
          ...reviewData,
          reviewer_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setReviews(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      console.error('Error creating review:', err);
      throw err;
    }
  };

  return {
    reviews,
    teamMembers,
    isLoading,
    error,
    createReview
  };
}
