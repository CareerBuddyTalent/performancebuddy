
import { useState } from "react";
import { User } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Users, Building } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface DepartmentManagementProps {
  departments: string[];
  users: User[];
  onAddDepartment: (department: string) => void;
  onUpdateUser: (user: User) => void;
}

export default function DepartmentManagement({ 
  departments, 
  users, 
  onAddDepartment,
  onUpdateUser
}: DepartmentManagementProps) {
  const { toast } = useToast();
  const [newDepartment, setNewDepartment] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0] || "");
  
  const handleAddDepartment = () => {
    if (newDepartment.trim() && !departments.includes(newDepartment.trim())) {
      onAddDepartment(newDepartment.trim());
      setNewDepartment("");
      toast({
        title: "Department added",
        description: `${newDepartment.trim()} has been added to the organization`,
      });
    } else if (departments.includes(newDepartment.trim())) {
      toast({
        title: "Department already exists",
        description: "Please enter a unique department name",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Department Management</CardTitle>
          <CardDescription>
            Add and manage departments in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="New department name"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={handleAddDepartment} disabled={!newDepartment.trim()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </div>
          
          <Tabs defaultValue={selectedDepartment} onValueChange={setSelectedDepartment}>
            <TabsList className="flex flex-wrap max-w-full">
              {departments.map((dept) => (
                <TabsTrigger key={dept} value={dept} className="flex items-center">
                  <Building className="mr-2 h-4 w-4" />
                  {dept}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {departments.map((dept) => (
              <TabsContent key={dept} value={dept} className="mt-6">
                <DepartmentMembers 
                  department={dept} 
                  users={users.filter(user => user.department === dept)}
                  allUsers={users}
                  onUpdateUser={onUpdateUser}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

interface DepartmentMembersProps {
  department: string;
  users: User[];
  allUsers: User[];
  onUpdateUser: (user: User) => void;
}

function DepartmentMembers({ department, users, allUsers, onUpdateUser }: DepartmentMembersProps) {
  const { toast } = useToast();
  const [showAddMembers, setShowAddMembers] = useState(false);
  
  const availableUsers = allUsers.filter(user => user.department !== department);
  
  const handleAddUserToDepartment = (user: User) => {
    const updatedUser = { ...user, department };
    onUpdateUser(updatedUser);
    toast({
      title: "User added to department",
      description: `${user.name} has been added to ${department}`,
    });
  };
  
  const handleRemoveUserFromDepartment = (user: User) => {
    const updatedUser = { ...user, department: undefined };
    onUpdateUser(updatedUser);
    toast({
      title: "User removed from department",
      description: `${user.name} has been removed from ${department}`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center">
          <Users className="mr-2 h-5 w-5" />
          {department} Members ({users.length})
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowAddMembers(!showAddMembers)}
        >
          {showAddMembers ? "Cancel" : "Add Members"}
        </Button>
      </div>
      
      {showAddMembers && (
        <div className="border rounded-md p-4 mb-6">
          <h4 className="text-sm font-medium mb-3">Available Users</h4>
          {availableUsers.length > 0 ? (
            <div className="space-y-2">
              {availableUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between bg-muted/40 p-2 rounded-md">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profilePicture} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.position || "No position"}</div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => handleAddUserToDepartment(user)}
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No users available to add</p>
          )}
        </div>
      )}
      
      {users.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <div key={user.id} className="flex flex-col border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.profilePicture} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                <Badge className="capitalize" variant={user.role === "manager" ? "default" : "secondary"}>
                  {user.role}
                </Badge>
              </div>
              <div className="mt-4 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Position:</span>
                  <span className="font-medium">{user.position || "Not set"}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Manager:</span>
                  <span className="font-medium">{user.manager || "Not set"}</span>
                </div>
              </div>
              <div className="mt-auto pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => handleRemoveUserFromDepartment(user)}
                >
                  Remove from {department}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          <Users className="mx-auto h-10 w-10 mb-3 opacity-50" />
          <p>No members in this department yet</p>
          <p className="text-sm mt-1">
            Add team members to {department} by clicking "Add Members"
          </p>
        </div>
      )}
    </div>
  );
}
