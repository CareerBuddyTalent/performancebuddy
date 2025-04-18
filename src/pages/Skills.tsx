import { useState } from "react";
import { toast } from "sonner";
import { SkillsHeader } from "@/components/skills/SkillsHeader";
import { SkillsContent } from "@/components/skills/SkillsContent";
import { AddSkillDialog } from "@/components/skills/AddSkillDialog";
import { ImportSkillsDialog } from "@/components/ImportSkillsDialog";
import { CreateDevelopmentPlanDialog } from "@/components/CreateDevelopmentPlanDialog";

export default function Skills() {
  const [showAddSkillDialog, setShowAddSkillDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showCreatePlanDialog, setShowCreatePlanDialog] = useState(false);
  
  // Mock data - in real app this would come from API/database
  const categories = ["Technical", "Leadership", "Communication", "Project Management"];
  
  const mockEmployees = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" }
  ];

  // Create properly typed mock roles
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

  // Create properly typed mock skills
  const mockFilteredSkills = [
    { 
      id: "1", 
      name: "JavaScript", 
      description: "Programming language",
      category: "Technical",
      levels: [
        {
          level: 1,
          description: "Beginner",
          expectations: ["Basic syntax"]
        }
      ]
    },
    { 
      id: "2", 
      name: "React", 
      description: "UI library",
      category: "Technical",
      levels: [
        {
          level: 1,
          description: "Beginner",
          expectations: ["Basic components"]
        }
      ]
    }
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
      <SkillsHeader onImportClick={() => setShowImportDialog(true)} />
      
      <SkillsContent
        categories={categories}
        showAddSkillDialog={showAddSkillDialog}
        onAddSkillClick={() => setShowAddSkillDialog(true)}
        skills={skills}
        plans={plans}
        onCreatePlan={() => setShowCreatePlanDialog(true)}
      />

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
