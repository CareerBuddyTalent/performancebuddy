
import { supabase } from '@/integrations/supabase/client';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';

export const createAuthService = (logAuthEvent: ReturnType<typeof useSecurityAudit>['logAuthEvent']) => {
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Starting login process for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        await logAuthEvent('login', false, { error: error.message });
        return false;
      }

      if (data.user) {
        console.log('Login successful for user:', data.user.id);
        await logAuthEvent('login', true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login failed:', error);
      await logAuthEvent('login', false, { error: 'Unexpected error' });
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log('Starting signup process for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name.trim()
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('Signup error:', error.message);
        await logAuthEvent('signup', false, { error: error.message });
        return false;
      }

      if (data.user) {
        console.log('Signup successful for user:', data.user.id);
        await logAuthEvent('signup', true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Signup failed:', error);
      await logAuthEvent('signup', false, { error: 'Unexpected error' });
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/reset-password`
        }
      );
      
      if (error) {
        console.error('Password reset error:', error);
        await logAuthEvent('password_reset', false);
        return false;
      }

      await logAuthEvent('password_reset', true);
      return true;
    } catch (error) {
      console.error('Password reset failed:', error);
      await logAuthEvent('password_reset', false);
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out user');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
      await logAuthEvent('logout', true);
    } catch (error) {
      console.error('Logout failed:', error);
      await logAuthEvent('logout', false);
    }
  };

  return {
    login,
    signup,
    resetPassword,
    logout
  };
};
