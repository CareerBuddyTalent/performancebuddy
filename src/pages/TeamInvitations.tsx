
import { InvitationManagementDashboard } from '@/components/invitations/InvitationManagementDashboard';
import { useUserManagement } from '@/hooks/useUserManagement';

export default function TeamInvitations() {
  const { departments, users } = useUserManagement();
  
  // Get managers from users data
  const managers = users
    .filter(user => user.role === 'manager' || user.role === 'admin')
    .map(user => ({
      id: user.id,
      name: user.name
    }));

  return (
    <div className="container mx-auto py-6">
      <InvitationManagementDashboard 
        departments={departments}
        managers={managers}
      />
    </div>
  );
}
