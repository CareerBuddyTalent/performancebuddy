import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Plus, GraduationCap, Users, Target, ListChecks, FileUp } from "lucide-react";
import SkillsMatrix from "@/components/SkillsMatrix";
import { Skill } from "@/types";
import { ImportSkillsDialog } from "@/components/ImportSkillsDialog";
import { toast } from "sonner";
import { DevelopmentPlan } from "@/components/CreateDevelopmentPlanDialog";
import { RoleMapping } from "@/components/skills/RoleMapping";
import { DevelopmentPlans } from "@/components/skills/DevelopmentPlans";
import { CareerPaths } from "@/components/skills/CareerPaths";
import { AddSkillDialog } from "@/components/skills/AddSkillDialog";
import { CreateDevelopmentPlanDialog } from "@/components/CreateDevelopmentPlanDialog";

const sampleSkills: Skill[] = [
  {
    id: "1",
    name: "JavaScript",
    description: "Proficiency in JavaScript programming language and ecosystem",
    category: "Technical",
    levels: [
      {
        level: 1,
        description: "Basic understanding of JavaScript syntax",
        expectations: ["Can write simple functions", "Understands basic data types"]
      },
      {
        level: 2,
        description: "Working knowledge of JavaScript core concepts",
        expectations: ["Can work with arrays and objects", "Understands scope and closures"]
      },
      {
        level: 3,
        description: "Good command of JavaScript and common patterns",
        expectations: ["Can implement complex functions", "Understands promises and async/await"]
      },
      {
        level: 4,
        description: "Advanced understanding of JavaScript",
        expectations: ["Can architect complex frontend applications", "Deep understanding of JS internals"]
      },
      {
        level: 5,
        description: "Expert-level JavaScript knowledge",
        expectations: ["Can create frameworks and libraries", "Deeply understands JS engine optimizations"]
      }
    ]
  },
  {
    id: "2",
    name: "Leadership",
    description: "Ability to guide, motivate and influence team members",
    category: "Soft Skills",
    levels: [
      {
        level: 1,
        description: "Demonstrates potential for leadership",
        expectations: ["Takes initiative on small tasks", "Helps other team members"]
      },
      {
        level: 2,
        description: "Shows leadership in specific situations",
        expectations: ["Can lead small meetings", "Mentors junior team members"]
      },
      {
        level: 3,
        description: "Effectively leads projects or initiatives",
        expectations: ["Manages small teams", "Provides constructive feedback"]
      },
      {
        level: 4,
        description: "Established leader with broader influence",
        expectations: ["Builds high-performing teams", "Develops leadership in others"]
      },
      {
        level: 5,
        description: "Strategic leader with organizational impact",
        expectations: ["Shapes company culture", "Drives organizational change"]
      }
    ]
  },
  {
    id: "3",
    name: "React",
    description: "Knowledge and skills in React.js library and ecosystem",
    category: "Technical",
    levels: [
      {
        level: 1,
        description: "Basic understanding of React components",
        expectations: ["Can create simple components", "Understands JSX syntax"]
      },
      {
        level: 2,
        description: "Practical knowledge of React fundamentals",
        expectations: ["Can use hooks like useState", "Understands component lifecycle"]
      },
      {
        level: 3,
        description: "Solid experience with React and common patterns",
        expectations: ["Can build complex applications", "Proficient with most hooks"]
      },
      {
        level: 4,
        description: "Advanced React skills and architectural knowledge",
        expectations: ["Can architect large-scale applications", "Creates custom hooks and patterns"]
      },
      {
        level: 5,
        description: "Expert-level React knowledge",
        expectations: ["Contributes to React ecosystem", "Optimizes performance at scale"]
      }
    ]
  },
  {
    id: "4",
    name: "SEO",
    description: "Search Engine Optimization techniques and strategies",
    category: "Marketing",
    levels: [
      {
        level: 1,
        description: "Basic understanding of SEO principles",
        expectations: ["Can perform basic keyword research", "Understands meta tags"]
      },
      {
        level: 2,
        description: "Working knowledge of SEO techniques",
        expectations: ["Can optimize content for keywords", "Understands backlinks and their importance"]
      },
      {
        level: 3,
        description: "Good command of SEO strategies",
        expectations: ["Can develop SEO content plans", "Understands technical SEO aspects"]
      },
      {
        level: 4,
        description: "Advanced SEO knowledge",
        expectations: ["Can develop comprehensive SEO strategies", "Deep understanding of search algorithms"]
      },
      {
        level: 5,
        description: "Expert-level SEO strategist",
        expectations: ["Can lead enterprise SEO initiatives", "Keeps up with algorithm changes and industry trends"]
      }
    ]
  },
  {
    id: "5",
    name: "Project Management",
    description: "Ability to plan, execute and close projects effectively",
    category: "Management",
    levels: [
      {
        level: 1,
        description: "Basic understanding of project management",
        expectations: ["Can track tasks and deadlines", "Participates in project meetings"]
      },
      {
        level: 2,
        description: "Working knowledge of project management methods",
        expectations: ["Can manage small projects", "Understands project lifecycle"]
      },
      {
        level: 3,
        description: "Proficient project manager",
        expectations: ["Can lead medium-sized projects", "Manages resources and timelines effectively"]
      },
      {
        level: 4,
        description: "Advanced project management skills",
        expectations: ["Manages complex projects and teams", "Implements process improvements"]
      },
      {
        level: 5,
        description: "Expert project leadership",
        expectations: ["Leads enterprise-level initiatives", "Develops project management frameworks"]
      }
    ]
  }
];

const roles = [
  { id: "1", title: "Frontend Developer", department: "Engineering", skills: ["1", "3"] },
  { id: "2", title: "Marketing Specialist", department: "Marketing", skills: ["4"] },
  { id: "3", title: "Project Manager", department: "Operations", skills: ["2", "5"] },
  { id: "4", title: "Full Stack Developer", department: "Engineering", skills: ["1", "3"] },
  { id: "5", title: "Team Lead", department: "Engineering", skills: ["1", "2", "3", "5"] }
];

const developmentPlans = [
  {
    id: "1",
    employeeId: "1",
    title: "Frontend Expertise Development",
    skills: ["1", "3"], 
    objectives: [
      { id: "obj1", description: "Complete Advanced React Course", dueDate: new Date(2024, 6, 30), status: "in_progress" },
      { id: "obj2", description: "Contribute to 3 open source projects", dueDate: new Date(2024, 8, 15), status: "not_started" }
    ],
    createdAt: new Date(2024, 1, 15),
    modifiedAt: new Date(2024, 2, 10)
  },
  {
    id: "2",
    employeeId: "2",
    title: "SEO Mastery Plan",
    skills: ["4"],
    objectives: [
      { id: "obj3", description: "Get SEO certification", dueDate: new Date(2024, 5, 20), status: "completed" },
      { id: "obj4", description: "Improve organic search by 15%", dueDate: new Date(2024, 7, 30), status: "in_progress" }
    ],
    createdAt: new Date(2024, 0, 5),
    modifiedAt: new Date(2024, 3, 2)
  }
];

const employees = [
  { id: "1", name: "Alex Johnson" },
  { id: "2", name: "Sam Wilson" },
  { id: "3", name: "Taylor Rodriguez" },
  { id: "4", name: "Jordan Lee" },
  { id: "5", name: "Casey Martinez" }
];

export default function Skills() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isCreatePlanDialogOpen, setIsCreatePlanDialogOpen] = useState(false);
  const [skills, setSkills] = useState<Skill[]>(sampleSkills);
  const [plans, setPlans] = useState<DevelopmentPlan[]>(developmentPlans as DevelopmentPlan[]);
  
  const categories = Array.from(new Set(skills.map(skill => skill.category)));
  
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || skill.category === selectedCategory;
    const matchesRole = !selectedRole || roles.find(r => r.id === selectedRole)?.skills.includes(skill.id);
    return matchesSearch && matchesCategory && (selectedRole ? matchesRole : true);
  });

  const handleImportComplete = (importedSkills: Skill[]) => {
    setSkills(prevSkills => {
      const existingNames = new Set(prevSkills.map(s => s.name.toLowerCase()));
      const newSkills = importedSkills.filter(s => !existingNames.has(s.name.toLowerCase()));
      const updatedSkills = [...prevSkills, ...newSkills];
      return updatedSkills;
    });
    
    toast.success(`Successfully imported ${importedSkills.length} skills`);
  };

  const handleAddDevelopmentPlan = (newPlan: DevelopmentPlan) => {
    setPlans(prevPlans => [newPlan, ...prevPlans]);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Skills & Competencies</h1>
        <p className="text-muted-foreground">
          Define and manage skills, competencies, and career progression paths
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 items-center gap-4 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search skills..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
            <FileUp className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={() => setIsAddSkillDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Skill
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="matrix" className="space-y-4">
        <TabsList>
          <TabsTrigger value="matrix" className="flex items-center">
            <GraduationCap className="mr-2 h-4 w-4" />
            Competency Matrix
          </TabsTrigger>
          <TabsTrigger value="role-mapping" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Role Mapping
          </TabsTrigger>
          <TabsTrigger value="development-plans" className="flex items-center">
            <Target className="mr-2 h-4 w-4" />
            Development Plans
          </TabsTrigger>
          <TabsTrigger value="career-paths" className="flex items-center">
            <ListChecks className="mr-2 h-4 w-4" />
            Career Paths
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="matrix" className="space-y-4">
          <SkillsMatrix skills={filteredSkills} selectedCategory={selectedCategory} />
        </TabsContent>
        
        <TabsContent value="role-mapping" className="space-y-4">
          <RoleMapping 
            roles={roles} 
            skills={sampleSkills} 
            filteredSkills={filteredSkills} 
          />
        </TabsContent>
        
        <TabsContent value="development-plans" className="space-y-4">
          <DevelopmentPlans 
            plans={plans} 
            skills={skills} 
            onOpenCreatePlanDialog={() => setIsCreatePlanDialogOpen(true)}
          />
        </TabsContent>
        
        <TabsContent value="career-paths" className="space-y-4">
          <CareerPaths />
        </TabsContent>
      </Tabs>
      
      <AddSkillDialog 
        open={isAddSkillDialogOpen} 
        onOpenChange={setIsAddSkillDialogOpen} 
        categories={categories} 
      />

      <ImportSkillsDialog 
        open={isImportDialogOpen} 
        onOpenChange={setIsImportDialogOpen} 
        onImportComplete={handleImportComplete} 
      />

      <CreateDevelopmentPlanDialog
        open={isCreatePlanDialogOpen}
        onOpenChange={setIsCreatePlanDialogOpen}
        onSubmit={handleAddDevelopmentPlan}
        skills={skills}
        employees={employees}
      />
    </div>
  );
}
