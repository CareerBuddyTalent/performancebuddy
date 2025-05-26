
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

export function useRealUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');

        if (profilesError) throw profilesError;

        // Transform profiles to User format
        const transformedUsers: User[] = (profiles || []).map(profile => ({
          id: profile.id,
          name: profile.name || 'Unknown User',
          email: profile.email,
          role: (profile.role as 'employee' | 'manager' | 'admin') || 'employee',
          profilePicture: profile.avatar_url,
          department: 'Engineering', // Default for now
          position: 'Software Engineer', // Default for now
        }));

        setUsers(transformedUsers);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.message);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    error
  };
}
