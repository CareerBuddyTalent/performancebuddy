
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Upload, BarChart } from "lucide-react";
import { SkillCategories } from "@/components/skills/SkillCategories";
import { CreateDevelopmentPlanDialog } from "@/components/CreateDevelopmentPlanDialog";
import { DevelopmentPlans } from "@/components/skills/DevelopmentPlans";
import { ImportSkillsDialog } from "@/components/ImportSkillsDialog";
import { AddSkillDialog } from "@/components/skills/AddSkillDialog";
import { CareerPaths } from "@/components/skills/CareerPaths";
import { RoleMapping } from "@/components/skills/RoleMapping";
import { RoleSkillsMapping } from "@/components/skills/RoleSkillsMapping";
import { toast } from "sonner";

export default function Skills() {
  const [activeTab, setActiveTab] = useState("skills");
  const [showAddSkillDialog, setShowAddSkillDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showCreatePlanDialog, setShowCreatePlanDialog] = useState(false);
  
  // Mock data - in real app this would come from API/database
  const categories = ["Technical", "Leadership", "Communication", "Project Management"];
  
  const mockEmployees = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" }
  ];

  const mockRoles = [
    { id: "1", name: "Frontend Developer" },
    { id: "2", name: "Backend Developer" }
  ];

  const mockFilteredSkills = [
    { id: "1", name: "JavaScript" },
    { id: "2", name: "React" }
  ];
  
  const plans = [
    {
      id: "1",
      title: "Engineering Leadership Development",
      employeeId: "1",
      skills: ["leadership", "communication", "mentoring"],
      description: "Development plan for engineering leaders",
      objectives: [
        { id: "1", description: "Complete leadership workshop", dueDate: new Date(2023, 6, 15), status: "completed" as const },
        { id: "2", description: "Mentor 2 junior developers", dueDate: new Date(2023, 8, 30), status: "in_progress" as const },
        { id: "3", description: "Present at team knowledge sharing session", dueDate: new Date(2023, 9, 15), status: "not_started" as const }
      ],
      createdAt: new Date(2023, 5, 1),
      modifiedAt: new Date(2023, 5, 1)
    },
    {
      id: "2",
      title: "Frontend Developer Growth Plan",
      employeeId: "2",
      skills: ["react", "typescript", "ui-design"],
      description: "Skill development for frontend specialists",
      objectives: [
        { id: "4", description: "Build 3 complex components", dueDate: new Date(2023, 7, 15), status: "in_progress" as const },
        { id: "5", description: "Complete Advanced TypeScript course", dueDate: new Date(2023, 8, 20), status: "not_started" as const },
        { id: "6", description: "Refactor legacy UI component", dueDate: new Date(2023, 9, 10), status: "not_started" as const }
      ],
      createdAt: new Date(2023, 6, 1),
      modifiedAt: new Date(2023, 6, 5)
    }
  ];
  
  const skills = [
    {
      id: "1",
      name: "React Development",
      description: "Building UIs with React and related technologies",
      category: "Technical",
      levels: [
        {
          level: 1,
          description: "Basic knowledge",
          expectations: ["Can create simple components", "Understands props and state"]
        },
        {
          level: 2,
          description: "Intermediate",
          expectations: ["Can use hooks effectively", "Understands component lifecycle"]
        },
        {
          level: 3,
          description: "Advanced",
          expectations: ["Can optimize performance", "Can build complex state management solutions"]
        }
      ]
    }
  ];

  const handleImportComplete = () => {
    toast.success("Skills imported successfully");
  };

  const handleCreatePlan = (plan: any) => {
    toast.success(`Development plan "${plan.title}" created successfully`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Skills & Development</h1>
          <p className="text-muted-foreground">
            Manage skills, career paths, and development plans
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowImportDialog(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="default">
            <Eye className="mr-2 h-4 w-4" />
            Skills Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:grid-cols-6 lg:w-[600px]">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="career-paths">Career Paths</TabsTrigger>
          <TabsTrigger value="role-mapping">Role Mapping</TabsTrigger>
          <TabsTrigger value="role-skills">Role Skills</TabsTrigger>
          <TabsTrigger value="development">Development Plans</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Skills Catalog</CardTitle>
                <CardDescription>Manage skills and competencies</CardDescription>
              </div>
              <Button onClick={() => setShowAddSkillDialog(true)}>
                Add Skill
              </Button>
            </CardHeader>
            <CardContent>
              <SkillCategories categories={categories} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="career-paths" className="space-y-4">
          <CareerPaths />
        </TabsContent>
        
        <TabsContent value="role-mapping" className="space-y-4">
          <RoleMapping 
            roles={mockRoles} 
            skills={skills} 
            filteredSkills={mockFilteredSkills} 
          />
        </TabsContent>

        <TabsContent value="role-skills" className="space-y-4">
          <RoleSkillsMapping />
        </TabsContent>
        
        <TabsContent value="development" className="space-y-4">
          <DevelopmentPlans 
            plans={plans} 
            skills={skills}
            onOpenCreatePlanDialog={() => setShowCreatePlanDialog(true)}
          />
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Skills Analytics</CardTitle>
                <CardDescription>View skills distribution and gaps</CardDescription>
              </div>
              <Button variant="outline">
                <BarChart className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">Analytics features coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddSkillDialog 
        open={showAddSkillDialog} 
        onOpenChange={setShowAddSkillDialog}
        categories={categories}
      />
      
      <ImportSkillsDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImportComplete={handleImportComplete}
      />
      
      <CreateDevelopmentPlanDialog
        open={showCreatePlanDialog}
        onOpenChange={setShowCreatePlanDialog}
        onSubmit={handleCreatePlan}
        skills={skills}
        employees={mockEmployees}
      />
    </div>
  );
}
