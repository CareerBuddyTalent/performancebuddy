
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

export interface TeamInvitation {
  id: string;
  email: string;
  invitedBy: string;
  companyId?: string;
  department?: string;
  jobPosition?: string;
  role: 'admin' | 'manager' | 'employee';
  teamLeadId?: string;
  invitationToken: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  expiresAt: string;
  acceptedAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface CreateInvitationData {
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department?: string;
  jobPosition?: string;
  teamLeadId?: string;
  companyId?: string;
}

export function useTeamInvitations() {
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { user } = useSupabaseAuth();

  // Fetch all invitations (admin/manager only)
  const fetchInvitations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select(`
          id,
          email,
          invited_by,
          company_id,
          department,
          job_position,
          role,
          team_lead_id,
          invitation_token,
          status,
          expires_at,
          accepted_at,
          created_at,
          updated_at,
          metadata
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedInvitations: TeamInvitation[] = (data || []).map(invitation => ({
        id: invitation.id,
        email: invitation.email,
        invitedBy: invitation.invited_by,
        companyId: invitation.company_id,
        department: invitation.department,
        jobPosition: invitation.job_position,
        role: invitation.role,
        teamLeadId: invitation.team_lead_id,
        invitationToken: invitation.invitation_token,
        status: invitation.status,
        expiresAt: invitation.expires_at,
        acceptedAt: invitation.accepted_at,
        createdAt: invitation.created_at,
        updatedAt: invitation.updated_at,
        metadata: invitation.metadata || {}
      }));

      setInvitations(transformedInvitations);
    } catch (error: any) {
      console.error('Error fetching invitations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load invitations',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Send team invitation
  const sendInvitation = async (invitationData: CreateInvitationData): Promise<boolean> => {
    if (!user) return false;

    setIsSending(true);
    try {
      // Create invitation record
      const { data: invitation, error: createError } = await supabase
        .from('invitations')
        .insert({
          email: invitationData.email.toLowerCase().trim(),
          invited_by: user.id,
          company_id: invitationData.companyId,
          department: invitationData.department,
          job_position: invitationData.jobPosition,
          role: invitationData.role,
          team_lead_id: invitationData.teamLeadId,
        })
        .select()
        .single();

      if (createError) throw createError;

      // Send invitation email
      const emailData = {
        email: invitationData.email,
        inviterName: user.name || user.email,
        companyName: 'Your Organization', // Could be dynamic based on company data
        role: invitationData.role,
        department: invitationData.department,
        invitationToken: invitation.invitation_token,
        expiresAt: invitation.expires_at,
      };

      const { error: emailError } = await supabase.functions.invoke('send-team-invitation', {
        body: { data: emailData },
      });

      if (emailError) {
        console.warn('Email sending failed, but invitation was created:', emailError);
        toast({
          title: 'Invitation Created',
          description: 'Invitation was created but email sending failed. You can resend it later.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Invitation Sent',
          description: `Team invitation sent to ${invitationData.email}`,
        });
      }

      // Refresh invitations list
      await fetchInvitations();
      return true;

    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send invitation',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSending(false);
    }
  };

  // Resend invitation email
  const resendInvitation = async (invitationId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const invitation = invitations.find(inv => inv.id === invitationId);
      if (!invitation) throw new Error('Invitation not found');

      if (invitation.status !== 'pending') {
        throw new Error('Can only resend pending invitations');
      }

      const emailData = {
        email: invitation.email,
        inviterName: user.name || user.email,
        companyName: 'Your Organization',
        role: invitation.role,
        department: invitation.department,
        invitationToken: invitation.invitationToken,
        expiresAt: invitation.expiresAt,
      };

      const { error } = await supabase.functions.invoke('send-team-invitation', {
        body: { data: emailData },
      });

      if (error) throw error;

      toast({
        title: 'Invitation Resent',
        description: `Invitation resent to ${invitation.email}`,
      });

      return true;

    } catch (error: any) {
      console.error('Error resending invitation:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to resend invitation',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Cancel invitation
  const cancelInvitation = async (invitationId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('invitations')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: 'Invitation Cancelled',
        description: 'The invitation has been cancelled',
      });

      // Refresh invitations list
      await fetchInvitations();
      return true;

    } catch (error: any) {
      console.error('Error cancelling invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel invitation',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Bulk invite from CSV data
  const sendBulkInvitations = async (invitationsData: CreateInvitationData[]): Promise<{ success: number; failed: number }> => {
    let success = 0;
    let failed = 0;

    for (const invitationData of invitationsData) {
      const result = await sendInvitation(invitationData);
      if (result) {
        success++;
      } else {
        failed++;
      }
      // Add small delay to avoid overwhelming the email service
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    toast({
      title: 'Bulk Invitations Complete',
      description: `${success} invitations sent successfully, ${failed} failed`,
      variant: success > 0 ? 'default' : 'destructive',
    });

    return { success, failed };
  };

  // Validate invitation token (for signup page)
  const validateInvitationToken = async (token: string) => {
    try {
      const { data, error } = await supabase.rpc('validate_invitation_token', {
        token: token
      });

      if (error) throw error;

      return data && data.length > 0 ? data[0] : null;
    } catch (error: any) {
      console.error('Error validating invitation token:', error);
      return null;
    }
  };

  // Accept invitation (called during signup)
  const acceptInvitation = async (token: string, userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('accept_invitation', {
        token: token,
        user_id: userId
      });

      if (error) throw error;

      return data === true;
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'manager')) {
      fetchInvitations();
    }
  }, [user]);

  return {
    invitations,
    isLoading,
    isSending,
    sendInvitation,
    resendInvitation,
    cancelInvitation,
    sendBulkInvitations,
    validateInvitationToken,
    acceptInvitation,
    fetchInvitations,
  };
}
