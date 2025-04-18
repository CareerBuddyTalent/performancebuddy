import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkillsCatalog } from "./SkillsCatalog";
import { CareerPaths } from "./CareerPaths";
import { RoleMapping } from "./RoleMapping";
import { RoleSkillsMapping } from "./RoleSkillsMapping";
import { DevelopmentPlans } from "./DevelopmentPlans";
import { SkillsAnalytics } from "./SkillsAnalytics";
import { SkillsReport } from "./SkillsReport";
import { Skill } from "@/types";

interface SkillsContentProps {
  categories: string[];
  showAddSkillDialog: boolean;
  onAddSkillClick: () => void;
  skills: Skill[];
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

  // Mock data for RoleMapping component
  const mockRoles = [
    { 
      id: "1", 
      title: "Frontend Developer", 
      department: "Engineering",
      skills: ["1", "2"] 
    },
    { 
      id: "2", 
      title: "Backend Developer", 
      department: "Engineering",
      skills: ["3", "4"] 
    }
  ];
  
  // Create a filtered version of skills for RoleMapping
  const filteredSkills = skills.map(skill => ({
    ...skill,
    id: skill.id || crypto.randomUUID()
  }));

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid grid-cols-4 md:grid-cols-7 lg:w-[700px]">
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="career-paths">Career Paths</TabsTrigger>
        <TabsTrigger value="role-mapping">Role Mapping</TabsTrigger>
        <TabsTrigger value="role-skills">Role Skills</TabsTrigger>
        <TabsTrigger value="development">Development Plans</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="report">Report</TabsTrigger>
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
        <RoleMapping 
          roles={mockRoles}
          skills={skills}
          filteredSkills={filteredSkills}
        />
      </TabsContent>
      
      <TabsContent value="role-skills">
        <RoleSkillsMapping />
      </TabsContent>
      
      <TabsContent value="development">
        <DevelopmentPlans 
          plans={plans}
          skills={skills}
          onOpenCreatePlanDialog={() => onCreatePlan({})}
        />
      </TabsContent>
      
      <TabsContent value="analytics">
        <SkillsAnalytics />
      </TabsContent>
      
      <TabsContent value="report">
        <SkillsReport />
      </TabsContent>
    </Tabs>
  );
}
