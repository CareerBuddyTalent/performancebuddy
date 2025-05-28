import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';

interface DashboardTask {
  id: string;
  title: string;
  description: string;
  type: 'review' | 'goal' | 'feedback' | 'development';
  priority: 'high' | 'medium' | 'low';
  due_date?: string;
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string;
}

interface DashboardStats {
  totalGoals: number;
  completedGoals: number;
  pendingReviews: number;
  teamSize: number;
  averageProgress: number;
}

export function useRealDashboardData() {
  const { user } = useSupabaseAuth();
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalGoals: 0,
    completedGoals: 0,
    pendingReviews: 0,
    teamSize: 0,
    averageProgress: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        // Generate tasks based on user's actual data
        const dashboardTasks: DashboardTask[] = [];

        // Fetch user's goals
        const { data: goalsData } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id);

        // Fetch pending reviews
        const { data: reviewsData } = await supabase
          .from('performance_reviews')
          .select('*')
          .eq('employee_id', user.id)
          .eq('status', 'pending');

        // Create tasks from goals
        if (goalsData) {
          goalsData.forEach(goal => {
            if (goal.status !== 'completed') {
              dashboardTasks.push({
                id: `goal-${goal.id}`,
                title: `Update progress on: ${goal.title}`,
                description: `Track your progress on ${goal.title}`,
                type: 'goal',
                priority: goal.due_date && new Date(goal.due_date) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? 'high' : 'medium',
                due_date: goal.due_date,
                status: goal.status === 'in_progress' ? 'in_progress' : 'pending',
                created_at: goal.created_at
              });
            }
          });
        }

        // Create tasks from pending reviews
        if (reviewsData) {
          reviewsData.forEach(review => {
            dashboardTasks.push({
              id: `review-${review.id}`,
              title: 'Complete Performance Review',
              description: `Complete your ${review.review_type} review`,
              type: 'review',
              priority: 'high',
              status: 'pending',
              created_at: review.created_at
            });
          });
        }

        // Calculate stats
        const totalGoals = goalsData?.length || 0;
        const completedGoals = goalsData?.filter(g => g.status === 'completed').length || 0;
        const pendingReviews = reviewsData?.length || 0;
        
        // Get team size for managers
        let teamSize = 0;
        if (user.role === 'manager') {
          const { data: teamData } = await supabase
            .from('profiles')
            .select('id')
            .eq('manager', user.id);
          teamSize = teamData?.length || 0;
        }

        const averageProgress = totalGoals > 0 
          ? Math.round((goalsData?.reduce((sum, goal) => sum + (goal.progress || 0), 0) || 0) / totalGoals)
          : 0;

        setTasks(dashboardTasks);
        setStats({
          totalGoals,
          completedGoals,
          pendingReviews,
          teamSize,
          averageProgress
        });
        setError(null);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return {
    tasks,
    stats,
    isLoading,
    error
  };
}
