
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { users } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { User, UserRole } from "@/types";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MyProfile() {
  const { user, switchRole } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    department: "",
    bio: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (user) {
      // Find additional user data from mock data
      const userData = users.find(u => u.id === user.id);
      if (userData) {
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          position: userData.position || "",
          department: userData.department || "",
          bio: userData.bio || ""
        });
      }
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    // In a real application, we would save this to the database
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully."
    });
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    // Reset form data to original values
    if (user) {
      const userData = users.find(u => u.id === user.id);
      if (userData) {
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          position: userData.position || "",
          department: userData.department || "",
          bio: userData.bio || ""
        });
      }
    }
    setIsEditing(false);
  };

  const handleSwitchRole = (role: string) => {
    if (switchRole) {
      switchRole(role as UserRole);
    }
  };
  
  if (!user) return null;
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.profilePicture} alt={user.name} />
              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{formData.name}</h2>
            <p className="text-muted-foreground">{formData.position}</p>
            <p className="text-sm text-muted-foreground mt-1">{formData.department}</p>
            
            <Separator className="my-4" />
            
            <div className="w-full">
              <p className="text-sm font-medium mb-2">Account Type</p>
              <div className="bg-muted p-2 rounded-md text-sm">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </div>
              
              {/* Development environment role switcher */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Role Switcher (Dev Only)</p>
                  <Select 
                    value={user.role} 
                    onValueChange={handleSwitchRole}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Profile Information</CardTitle>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  <Button onClick={handleSave}>Save</Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal">
              <TabsList className="mb-4">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        name="name"
                        value={formData.name} 
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email"
                        value={formData.email} 
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input 
                        id="position" 
                        name="position"
                        value={formData.position} 
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select 
                        value={formData.department} 
                        onValueChange={(value) => handleSelectChange("department", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Product">Product</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="HR">HR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preferences">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Notification and application preferences will be available in a future update.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
