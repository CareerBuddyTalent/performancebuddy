
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement profile update logic here
    toast.success("Profile updated successfully");
  };
  
  if (!user) return null;
  
  const initials = user.name
    .split(" ")
    .map(name => name[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.profilePicture} alt={user.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg font-medium">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">{user.role}</p>
                {user.department && (
                  <p className="text-sm text-muted-foreground">{user.department}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-2/3">
          <Card>
            <CardHeader>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <TabsContent value="profile">
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                    />
                  </div>
                  
                  <Button type="submit">Save Changes</Button>
                </form>
              </TabsContent>
              
              <TabsContent value="security">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password</h3>
                  <p className="text-sm text-muted-foreground">
                    Update your password to keep your account secure.
                  </p>
                  <Button>Change Password</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="preferences">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure how and when you receive notifications.
                  </p>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
