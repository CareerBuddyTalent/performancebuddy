import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { Objective } from "@/types";
import MyObjectives from "@/components/okr/MyObjectives";
import TeamObjectives from "@/components/okr/TeamObjectives";
import CompanyObjectives from "@/components/okr/CompanyObjectives";
import CreateOKRDialog from "@/components/okr/CreateOKRDialog";
import OKRPeriodSelector from "@/components/okr/OKRPeriodSelector";

export default function PersonalOKRs() {
  const { user } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState("my-okrs");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  
  const handleCreateOKR = (objective: Objective) => {
    setObjectives(prev => [...prev, objective]);
  };
  
  if (!user) return null;
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Objectives & Key Results</h1>
          <p className="text-muted-foreground">
            Track and manage your personal and team OKRs
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <OKRPeriodSelector />
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Objective
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-okrs">My OKRs</TabsTrigger>
          <TabsTrigger value="team-okrs">Team OKRs</TabsTrigger>
          <TabsTrigger value="company-okrs">Company OKRs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-okrs" className="space-y-4">
          <MyObjectives userId={user.id} />
        </TabsContent>
        
        <TabsContent value="team-okrs" className="space-y-4">
          <TeamObjectives managerId={user.id} />
        </TabsContent>
        
        <TabsContent value="company-okrs" className="space-y-4">
          <CompanyObjectives />
        </TabsContent>
      </Tabs>
      
      <CreateOKRDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateOKR={handleCreateOKR}
        userId={user.id}
      />
    </div>
  );
}
