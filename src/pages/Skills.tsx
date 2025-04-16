
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import SkillsMatrix from "@/components/SkillsMatrix";
import { Skill } from "@/types";

// Sample skills data
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
  }
];

export default function Skills() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
  // Get unique categories
  const categories = Array.from(new Set(sampleSkills.map(skill => skill.category)));
  
  // Filter skills based on search and category
  const filteredSkills = sampleSkills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Skill
        </Button>
      </div>
      
      <Tabs defaultValue="matrix" className="space-y-4">
        <TabsList>
          <TabsTrigger value="matrix">Competency Matrix</TabsTrigger>
          <TabsTrigger value="career-paths">Career Paths</TabsTrigger>
        </TabsList>
        
        <TabsContent value="matrix" className="space-y-4">
          <SkillsMatrix skills={filteredSkills} selectedCategory={selectedCategory} />
        </TabsContent>
        
        <TabsContent value="career-paths" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Career Development Paths</CardTitle>
              <CardDescription>View and manage career progression paths within the organization</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">
                Career paths visualization will be available in the next release.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
