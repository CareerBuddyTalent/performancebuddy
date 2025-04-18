
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkillsCatalog } from "./SkillsCatalog";
import { CareerPaths } from "./CareerPaths";
import { RoleMapping } from "./RoleMapping";
import { RoleSkillsMapping } from "./RoleSkillsMapping";
import { DevelopmentPlans } from "./DevelopmentPlans";
import { SkillsAnalytics } from "./SkillsAnalytics";

interface SkillsContentProps {
  categories: string[];
  showAddSkillDialog: boolean;
  onAddSkillClick: () => void;
  skills: any[];
  plans: any[];
  onCreatePlan: (plan: any) => void;
}

export function SkillsContent({ 
  categories,
  showAddSkillDialog,
  onAddSkillClick,
  skills,
  plans,
  onCreatePlan
}: SkillsContentProps) {
  const [activeTab, setActiveTab] = useState("skills");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid grid-cols-4 md:grid-cols-6 lg:w-[600px]">
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="career-paths">Career Paths</TabsTrigger>
        <TabsTrigger value="role-mapping">Role Mapping</TabsTrigger>
        <TabsTrigger value="role-skills">Role Skills</TabsTrigger>
        <TabsTrigger value="development">Development Plans</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      
      <TabsContent value="skills">
        <SkillsCatalog 
          categories={categories}
          showAddSkillDialog={showAddSkillDialog}
          onAddSkillClick={onAddSkillClick}
        />
      </TabsContent>
      
      <TabsContent value="career-paths">
        <CareerPaths />
      </TabsContent>
      
      <TabsContent value="role-mapping">
        <RoleMapping />
      </TabsContent>
      
      <TabsContent value="role-skills">
        <RoleSkillsMapping />
      </TabsContent>
      
      <TabsContent value="development">
        <DevelopmentPlans 
          plans={plans}
          skills={skills}
          onOpenCreatePlanDialog={onCreatePlan}
        />
      </TabsContent>
      
      <TabsContent value="analytics">
        <SkillsAnalytics />
      </TabsContent>
    </Tabs>
  );
}
