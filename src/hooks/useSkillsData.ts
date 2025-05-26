
import { useState, useEffect } from 'react';
import { useClerkAuth } from '@/context/ClerkAuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
  created_at: string;
}

interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  competency_level: number;
  skill: Skill;
}

export function useSkillsData() {
  const { user } = useClerkAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkillsData = async () => {
      try {
        setIsLoading(true);

        // Fetch all available skills
        const { data: skillsData, error: skillsError } = await supabase
          .from('skills')
          .select('*')
          .order('category', { ascending: true });

        if (skillsError) throw skillsError;

        setSkills(skillsData || []);

        // Fetch user's skills if user is authenticated
        if (user) {
          const { data: userSkillsData, error: userSkillsError } = await supabase
            .from('user_skills')
            .select(`
              *,
              skill:skills(*)
            `)
            .eq('user_id', user.id);

          if (userSkillsError) throw userSkillsError;

          setUserSkills(userSkillsData || []);
        }
      } catch (err: any) {
        console.error('Error fetching skills data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkillsData();
  }, [user]);

  const updateUserSkill = async (skillId: string, competencyLevel: number) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_skills')
        .upsert({
          user_id: user.id,
          skill_id: skillId,
          competency_level: competencyLevel,
          updated_at: new Date().toISOString()
        })
        .select(`
          *,
          skill:skills(*)
        `)
        .single();

      if (error) throw error;

      setUserSkills(prev => {
        const existing = prev.find(us => us.skill_id === skillId);
        if (existing) {
          return prev.map(us => us.skill_id === skillId ? data : us);
        } else {
          return [...prev, data];
        }
      });
    } catch (err: any) {
      console.error('Error updating user skill:', err);
      throw err;
    }
  };

  return {
    skills,
    userSkills,
    isLoading,
    error,
    updateUserSkill
  };
}
