import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Calendar, Building } from "lucide-react";
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

interface UserProfileProps {
  userId: string;
}

export default function UserProfile({ userId }: UserProfileProps) {
  const { user } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Software Engineer",
    company: "TechCorp",
    location: "San Francisco, CA",
    startDate: "2022-03-15",
    skills: ["JavaScript", "React", "Node.js", "SQL"],
  });

  useEffect(() => {
    // Fetch user profile data based on userId (replace with actual data fetching)
    // For now, using dummy data
  }, [userId]);

  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">User Profile</CardTitle>
        <CardDescription>View and manage your profile information</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="rounded-full overflow-hidden w-24 h-24 border-2 border-primary/20">
            <img
              src="https://images.unsplash.com/photo-1502823403499-6ccfcf4cdca9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80"
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{profileData.name}</h2>
            <p className="text-muted-foreground">{profileData.role} at {profileData.company}</p>
          </div>
        </div>
        
        <Tabs defaultValue={activeTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-2">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm font-medium text-muted-foreground flex items-center space-x-2"><User className="h-4 w-4" /><span>Full Name</span></div>
                <div className="text-lg">{profileData.name}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground flex items-center space-x-2"><Mail className="h-4 w-4" /><span>Email Address</span></div>
                <div className="text-lg">{profileData.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground flex items-center space-x-2"><Building className="h-4 w-4" /><span>Company</span></div>
                <div className="text-lg">{profileData.company}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground flex items-center space-x-2"><Calendar className="h-4 w-4" /><span>Start Date</span></div>
                <div className="text-lg">{new Date(profileData.startDate).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Location</div>
                <div className="text-lg">{profileData.location}</div>
              </div>
            </div>
            <Button>Edit Profile</Button>
          </TabsContent>
          
          <TabsContent value="skills" className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <Badge key={index}>{skill}</Badge>
              ))}
            </div>
            <Button>Edit Skills</Button>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-2">
            <div>
              <p>Activity feed will appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
