
import UserManagementHeader from "@/components/users/management/UserManagementHeader";
import UserManagementTabs from "@/components/users/management/UserManagementTabs";
import AddUserDialog from "@/components/AddUserDialog";
import { useUserManagement } from "@/hooks/useUserManagement";

export default function UserManagement() {
  const {
    user,
    activeTab,
    setActiveTab,
    showAddUserDialog,
    setShowAddUserDialog,
    companies,
    selectedCompanyId,
    filteredUsers,
    departments,
    isLoading,
    isAdmin,
    handleCompanyChange,
    handleAddUser,
    handleAddDepartment,
    handleUpdateUser
  } = useUserManagement();

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-muted-foreground">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <UserManagementHeader
        isAdmin={isAdmin}
        userRole={user?.role}
        companies={companies}
        selectedCompanyId={selectedCompanyId}
        onCompanyChange={handleCompanyChange}
        onAddUser={() => setShowAddUserDialog(true)}
      />

      <UserManagementTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isAdmin={isAdmin}
        filteredUsers={filteredUsers}
        departments={departments}
        onUpdateUser={handleUpdateUser}
        onAddDepartment={handleAddDepartment}
      />

      <AddUserDialog 
        open={showAddUserDialog} 
        onOpenChange={setShowAddUserDialog}
        onAddUser={handleAddUser}
        departments={departments}
        onAddDepartment={handleAddDepartment}
      />
    </div>
  );
}
