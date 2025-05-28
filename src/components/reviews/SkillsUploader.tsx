
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

export const SkillsUploader = () => {
  const { user } = useSupabaseAuth();

  return (
    <div>
      {user ? (
        <p>Skills Uploader Component - User: {user.name}</p>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
};
