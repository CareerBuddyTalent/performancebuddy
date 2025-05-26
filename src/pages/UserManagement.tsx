import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter, Download, BarChart, Building2 } from "lucide-react";
import UserList from "@/components/UserList";
import AddUserDialog from "@/components/AddUserDialog";
import CompanySelector from "@/components/CompanySelector";
import { User, Company } from "@/types";
import DepartmentManagement from "@/components/DepartmentManagement";
import UserPerformanceRanking from "@/components/UserPerformanceRanking";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useClerkAuth } from "@/context/ClerkAuthContext";

export default function UserManagement() {
  const { user } = useClerkAuth();
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
        
        // Fetch users with their roles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            *,
            user_roles!inner(role)
          `);

        if (profilesError) throw profilesError;

        // Transform data to match User interface
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
          manager: profile.manager,
          companyId: profile.company_id || undefined
        }));

        setUsers(transformedUsers);
        
        // Extract unique departments
        const depts = Array.from(
          new Set(
            transformedUsers
              .map(user => user.department)
              .filter(Boolean) as string[]
          )
        );
        setDepartments(depts);

      } catch (error: any) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to load users.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user, toast]);

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
      // Create user profile in Supabase
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

      // Create user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: newUser.id,
          role: newUser.role
        });

      if (roleError) throw roleError;

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
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: updatedUser.name,
          department: updatedUser.department,
          position: updatedUser.position,
          manager: updatedUser.manager
        })
        .eq('id', updatedUser.id);

      if (profileError) throw profileError;

      // Update role if changed
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: updatedUser.id,
          role: updatedUser.role
        });

      if (roleError) throw roleError;

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, departments, and view performance rankings
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {isAdmin && (
            <div className="w-full sm:w-64">
              <CompanySelector
                companies={companies}
                selectedCompanyId={selectedCompanyId}
                onCompanyChange={handleCompanyChange}
              />
            </div>
          )}
          {(isAdmin || user?.role === "manager") && (
            <Button onClick={() => setShowAddUserDialog(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add User
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="allusers">All Users</TabsTrigger>
          {isAdmin && <TabsTrigger value="departments">Departments</TabsTrigger>}
          {isAdmin && <TabsTrigger value="performance">Performance Ranking</TabsTrigger>}
          {isAdmin && <TabsTrigger value="companies">Companies</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="allusers" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  Team Members
                </CardTitle>
                <CardDescription>
                  Manage team members and their roles in the organization
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <UserList 
                users={filteredUsers} 
                onUpdateUser={handleUpdateUser} 
                departments={departments}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="departments" className="space-y-4">
            <DepartmentManagement 
              departments={departments} 
              users={filteredUsers}
              onAddDepartment={handleAddDepartment}
              onUpdateUser={handleUpdateUser}
            />
          </TabsContent>
        )}
        
        {isAdmin && (
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    Performance Rankings
                  </CardTitle>
                  <CardDescription>
                    View top performers and performance rankings across the organization
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <BarChart className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </CardHeader>
              <CardContent>
                <UserPerformanceRanking users={filteredUsers} />
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {isAdmin && (
          <TabsContent value="companies" className="space-y-4">
            <Button asChild variant="outline" className="mb-4">
              <a href="/companies">
                <Building2 className="mr-2 h-4 w-4" />
                Manage Companies
              </a>
            </Button>
          </TabsContent>
        )}
      </Tabs>

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
