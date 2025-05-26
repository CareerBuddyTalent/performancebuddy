import React, { useState } from "react";
import { useClerkAuth } from "@/context/ClerkAuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, HeartHandshake } from "lucide-react";
import { ReviewSkill } from "@/types";
import { AddSkillForm } from "./AddSkillForm";
import { SkillsTable } from "./SkillsTable";

interface SkillsUploaderProps {
  skills: ReviewSkill[];
  onSkillAdded: (skill: ReviewSkill) => void;
  onSkillDeleted: (skillId: string) => void;
}

export function SkillsUploader({ skills, onSkillAdded, onSkillDeleted }: SkillsUploaderProps) {
  const [activeTab, setActiveTab] = useState("technical");
  const { user } = useClerkAuth();
  
  // Filter skills by category and visibility based on user role
  const filterSkillsByRole = (skills: ReviewSkill[], category: string) => {
    return skills.filter(skill => 
      skill.category === category && 
      skill.visibleTo.includes(user?.role || 'employee')
    );
  };
  
  const technicalSkills = filterSkillsByRole(skills, "technical");
  const softSkills = filterSkillsByRole(skills, "soft");
  
  // Only show add form for admin and manager roles
  const canManageSkills = user?.role === 'admin' || user?.role === 'manager';
  
  return (
    <div className="space-y-6">
      {canManageSkills && <AddSkillForm onSkillAdded={onSkillAdded} />}
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Review Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="technical" className="flex items-center">
                <Code className="mr-2 h-4 w-4" />
                Technical Skills ({technicalSkills.length})
              </TabsTrigger>
              <TabsTrigger value="soft" className="flex items-center">
                <HeartHandshake className="mr-2 h-4 w-4" />
                Soft Skills ({softSkills.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="technical">
              <SkillsTable 
                skills={technicalSkills} 
                onDeleteSkill={onSkillDeleted}
                categoryIcon="technical"
                canDelete={canManageSkills}
              />
            </TabsContent>
            
            <TabsContent value="soft">
              <SkillsTable 
                skills={softSkills} 
                onDeleteSkill={onSkillDeleted}
                categoryIcon="soft"
                canDelete={canManageSkills}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
