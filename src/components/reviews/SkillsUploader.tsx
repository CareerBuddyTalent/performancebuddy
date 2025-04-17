
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  
  // Filter skills by category
  const technicalSkills = skills.filter(skill => skill.category === "technical");
  const softSkills = skills.filter(skill => skill.category === "soft");
  
  return (
    <div className="space-y-6">
      <AddSkillForm onSkillAdded={onSkillAdded} />
      
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
              />
            </TabsContent>
            
            <TabsContent value="soft">
              <SkillsTable 
                skills={softSkills} 
                onDeleteSkill={onSkillDeleted}
                categoryIcon="soft"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
