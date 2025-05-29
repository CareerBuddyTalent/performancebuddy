
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { User, Company } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import { RoleSyncService } from "@/services/roleSync";

export function useUserManagement() {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("allusers");
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user?.role === "admin";
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            *,
            user_roles!inner(role)
          `);

        if (profilesError) throw profilesError;

        const transformedUsers: User[] = (profilesData || []).map(profile => ({
          id: profile.id,
          name: profile.name || profile.email.split('@')[0],
          email: profile.email,
          role: Array.isArray(profile.user_roles) && profile.user_roles.length > 0 
            ? profile.user_roles[0].role 
            : 'employee',
          department: profile.department,
          position: profile.position,
          profilePicture: profile.profile_picture,
          joinDate: new Date(profile.created_at),
          manager: profile.manager,
          skills: [],
          isActive: true
        }));

        setUsers(transformedUsers);
        setFilteredUsers(transformedUsers);

        const uniqueDepartments = [...new Set(transformedUsers
          .map(user => user.department)
          .filter(Boolean)
        )] as string[];
        
        setDepartments(uniqueDepartments);

      } catch (error: any) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  useEffect(() => {
    let companyUsers = users;
    
    if (isAdmin && selectedCompanyId) {
      companyUsers = users.filter(user => user.companyId === selectedCompanyId);
    } else if (!isAdmin) {
      companyUsers = users.filter(user => user.companyId === user?.companyId);
    }
    
    setFilteredUsers(companyUsers);
    
    if (isAdmin && selectedCompanyId) {
      setSearchParams({ company: selectedCompanyId });
    } else {
      setSearchParams({});
    }
  }, [selectedCompanyId, users, isAdmin, user?.companyId, setSearchParams]);

  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };
  
  const handleAddUser = async (newUser: User) => {
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          department: newUser.department,
          position: newUser.position,
          manager: newUser.manager
        });

      if (profileError) throw profileError;

      await RoleSyncService.updateUserRole(newUser.id, newUser.role);

      const userWithCompany = {
        ...newUser,
        companyId: selectedCompanyId,
        company: companies.find(c => c.id === selectedCompanyId)
      };
      
      setUsers(prev => [...prev, userWithCompany]);
      toast({
        title: "User added",
        description: `${newUser.name} has been added to the platform`,
      });
      setShowAddUserDialog(false);
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: "Failed to add user.",
        variant: "destructive",
      });
    }
  };

  const handleAddDepartment = (department: string) => {
    if (!departments.includes(department)) {
      setDepartments(prev => [...prev, department]);
      toast({
        title: "Department added",
        description: `${department} has been added to the organization`,
      });
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      await RoleSyncService.updateUserProfile(
        updatedUser.name,
        updatedUser.department,
        updatedUser.position,
        updatedUser.manager
      );

      if (isAdmin) {
        await RoleSyncService.updateUserRole(updatedUser.id, updatedUser.role);
      }

      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      toast({
        title: "User updated",
        description: `${updatedUser.name}'s profile has been updated`,
      });
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user.",
        variant: "destructive",
      });
    }
  };

  return {
    user,
    activeTab,
    setActiveTab,
    showAddUserDialog,
    setShowAddUserDialog,
    users,
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
  };
}
