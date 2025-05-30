
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Mail, Users, UserPlus } from 'lucide-react';
import { useTeamInvitations, CreateInvitationData } from '@/hooks/useTeamInvitations';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

interface SendInvitationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: string[];
  managers: Array<{ id: string; name: string }>;
}

export function SendInvitationDialog({ 
  open, 
  onOpenChange, 
  departments, 
  managers 
}: SendInvitationDialogProps) {
  const [formData, setFormData] = useState<CreateInvitationData>({
    email: '',
    role: 'employee',
    department: '',
    jobPosition: '',
    teamLeadId: '',
  });
  const [bulkEmails, setBulkEmails] = useState('');
  const [isBulkMode, setIsBulkMode] = useState(false);

  const { sendInvitation, sendBulkInvitations, isSending } = useTeamInvitations();
  const { user } = useSupabaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBulkMode) {
      // Parse bulk emails
      const emails = bulkEmails
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && line.includes('@'));
      
      if (emails.length === 0) {
        return;
      }

      const bulkInvitations: CreateInvitationData[] = emails.map(email => ({
        email,
        role: formData.role,
        department: formData.department,
        jobPosition: formData.jobPosition,
        teamLeadId: formData.teamLeadId,
      }));

      await sendBulkInvitations(bulkInvitations);
    } else {
      // Single invitation
      if (!formData.email) return;
      
      await sendInvitation(formData);
    }

    // Reset form and close dialog
    setFormData({
      email: '',
      role: 'employee',
      department: '',
      jobPosition: '',
      teamLeadId: '',
    });
    setBulkEmails('');
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      role: 'employee',
      department: '',
      jobPosition: '',
      teamLeadId: '',
    });
    setBulkEmails('');
    setIsBulkMode(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Team Members
          </DialogTitle>
          <DialogDescription>
            Send invitations to new team members to join your organization
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bulk/Single Mode Toggle */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={!isBulkMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsBulkMode(false)}
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Single Invite
            </Button>
            <Button
              type="button"
              variant={isBulkMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsBulkMode(true)}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Bulk Invite
            </Button>
          </div>

          {/* Email Input */}
          {!isBulkMode ? (
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@company.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="bulk-emails">Email Addresses (one per line)</Label>
              <Textarea
                id="bulk-emails"
                placeholder="colleague1@company.com&#10;colleague2@company.com&#10;colleague3@company.com"
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e.target.value)}
                className="min-h-[120px]"
                required
              />
              <p className="text-sm text-muted-foreground">
                Enter one email address per line
              </p>
            </div>
          )}

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              value={formData.role} 
              onValueChange={(value: 'admin' | 'manager' | 'employee') => 
                setFormData(prev => ({ ...prev, role: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                {user?.role === 'admin' && (
                  <SelectItem value="admin">Admin</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Department Selection */}
          <div className="space-y-2">
            <Label htmlFor="department">Department (Optional)</Label>
            <Select 
              value={formData.department} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Department</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label htmlFor="position">Position (Optional)</Label>
            <Input
              id="position"
              placeholder="e.g. Senior Developer, Product Manager"
              value={formData.jobPosition}
              onChange={(e) => setFormData(prev => ({ ...prev, jobPosition: e.target.value }))}
            />
          </div>

          {/* Team Lead Selection */}
          <div className="space-y-2">
            <Label htmlFor="teamLead">Team Lead (Optional)</Label>
            <Select 
              value={formData.teamLeadId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, teamLeadId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team lead" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Team Lead</SelectItem>
                {managers.map((manager) => (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSending}>
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  {isBulkMode ? 'Send Invitations' : 'Send Invitation'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
