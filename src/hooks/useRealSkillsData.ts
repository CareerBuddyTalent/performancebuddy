
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
  proficiency_level: number;
  years_of_experience?: number;
  last_assessed?: string;
  created_at: string;
  skill: Skill;
}

export function useRealSkillsData() {
  const { user } = useClerkAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkillsData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        // Fetch all available skills
        const { data: skillsData, error: skillsError } = await supabase
          .from('skills')
          .select('*')
          .order('category', { ascending: true });

        if (skillsError) throw skillsError;

        // Fetch user's skills with skill details
        const { data: userSkillsData, error: userSkillsError } = await supabase
          .from('user_skills')
          .select(`
            *,
            skill:skills(*)
          `)
          .eq('user_id', user.id);

        if (userSkillsError) throw userSkillsError;

        setSkills(skillsData || []);
        setUserSkills(userSkillsData || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching skills data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkillsData();
  }, [user]);

  const addUserSkill = async (skillId: string, proficiencyLevel: number, yearsOfExperience?: number) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_skills')
        .insert({
          user_id: user.id,
          skill_id: skillId,
          proficiency_level: proficiencyLevel,
          years_of_experience: yearsOfExperience
        })
        .select(`
          *,
          skill:skills(*)
        `)
        .single();

      if (error) throw error;

      setUserSkills(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      console.error('Error adding user skill:', err);
      throw err;
    }
  };

  const updateUserSkill = async (userSkillId: string, updates: Partial<UserSkill>) => {
    try {
      const { data, error } = await supabase
        .from('user_skills')
        .update(updates)
        .eq('id', userSkillId)
        .select(`
          *,
          skill:skills(*)
        `)
        .single();

      if (error) throw error;

      setUserSkills(prev => prev.map(us => us.id === userSkillId ? data : us));
      return data;
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
    addUserSkill,
    updateUserSkill
  };
}
