
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter, Download, BarChart, Building2 } from "lucide-react";
import UserList from "@/components/UserList";
import AddUserDialog from "@/components/AddUserDialog";
import { User, Company } from "@/types";
import DepartmentManagement from "@/components/DepartmentManagement";
import UserPerformanceRanking from "@/components/UserPerformanceRanking";
import { useToast } from "@/components/ui/use-toast";
import { users as mockUsers, companies as mockCompanies } from "@/data/mockData";
import CompanySelector from "@/components/CompanySelector";

export default function UserManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("allusers");
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    searchParams.get("company") || (companies.length > 0 ? companies[0].id : "")
  );
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

  const isAdmin = user?.role === "admin";
  
  // Update filtered users when company selection changes
  useEffect(() => {
    const companyUsers = selectedCompanyId 
      ? users.filter(user => user.companyId === selectedCompanyId)
      : users;
    
    setFilteredUsers(companyUsers);
    
    // Extract unique departments from the filtered users
    const depts = Array.from(
      new Set(
        companyUsers
          .map(user => user.department)
          .filter(Boolean) as string[]
      )
    );
    setDepartments(depts);
    
    // Update URL with selected company
    if (selectedCompanyId) {
      setSearchParams({ company: selectedCompanyId });
    } else {
      setSearchParams({});
    }
  }, [selectedCompanyId, users, setSearchParams]);

  // Handle company change
  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
  };
  
  const handleAddUser = (newUser: User) => {
    // Assign the selected company to the new user
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

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    toast({
      title: "User updated",
      description: `${updatedUser.name}'s profile has been updated`,
    });
  };

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
          <div className="w-full sm:w-64">
            <CompanySelector
              companies={companies}
              selectedCompanyId={selectedCompanyId}
              onCompanyChange={handleCompanyChange}
            />
          </div>
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
                  {companies.find(c => c.id === selectedCompanyId)?.name || "All Companies"}
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
                    {companies.find(c => c.id === selectedCompanyId)?.name || "All Companies"} - Performance Rankings
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
