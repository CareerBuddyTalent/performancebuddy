
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/types";
import AllUsersTab from "./tabs/AllUsersTab";
import DepartmentsTab from "./tabs/DepartmentsTab";
import PerformanceTab from "./tabs/PerformanceTab";
import CompaniesTab from "./tabs/CompaniesTab";

interface UserManagementTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin: boolean;
  filteredUsers: User[];
  departments: string[];
  onUpdateUser: (user: User) => void;
  onAddDepartment: (department: string) => void;
}

export default function UserManagementTabs({
  activeTab,
  onTabChange,
  isAdmin,
  filteredUsers,
  departments,
  onUpdateUser,
  onAddDepartment
}: UserManagementTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
      <TabsList>
        <TabsTrigger value="allusers">All Users</TabsTrigger>
        {isAdmin && <TabsTrigger value="departments">Departments</TabsTrigger>}
        {isAdmin && <TabsTrigger value="performance">Performance Ranking</TabsTrigger>}
        {isAdmin && <TabsTrigger value="companies">Companies</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="allusers" className="space-y-4">
        <AllUsersTab 
          users={filteredUsers}
          departments={departments}
          onUpdateUser={onUpdateUser}
        />
      </TabsContent>
      
      {isAdmin && (
        <TabsContent value="departments" className="space-y-4">
          <DepartmentsTab
            departments={departments}
            users={filteredUsers}
            onAddDepartment={onAddDepartment}
            onUpdateUser={onUpdateUser}
          />
        </TabsContent>
      )}
      
      {isAdmin && (
        <TabsContent value="performance" className="space-y-4">
          <PerformanceTab users={filteredUsers} />
        </TabsContent>
      )}
      
      {isAdmin && (
        <TabsContent value="companies" className="space-y-4">
          <CompaniesTab />
        </TabsContent>
      )}
    </Tabs>
  );
}
