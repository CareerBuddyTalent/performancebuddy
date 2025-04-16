import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Plus, GraduationCap, Users, Target, ListChecks, LineChart } from "lucide-react";
import SkillsMatrix from "@/components/SkillsMatrix";
import { Skill } from "@/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

// Sample roles data
const roles = [
  { id: "1", title: "Frontend Developer", department: "Engineering", skills: ["1", "3"] },
  { id: "2", title: "Marketing Specialist", department: "Marketing", skills: ["4"] },
  { id: "3", title: "Project Manager", department: "Operations", skills: ["2", "5"] },
  { id: "4", title: "Full Stack Developer", department: "Engineering", skills: ["1", "3"] },
  { id: "5", title: "Team Lead", department: "Engineering", skills: ["1", "2", "3", "5"] }
];

// Sample development plans
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

export default function Skills() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);
  
  // Get unique categories
  const categories = Array.from(new Set(sampleSkills.map(skill => skill.category)));
  
  // Filter skills based on search, category, and role
  const filteredSkills = sampleSkills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || skill.category === selectedCategory;
    const matchesRole = !selectedRole || roles.find(r => r.id === selectedRole)?.skills.includes(skill.id);
    return matchesSearch && matchesCategory && (selectedRole ? matchesRole : true);
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
        <Button onClick={() => setIsAddSkillDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Skill
        </Button>
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
          <Card>
            <CardHeader>
              <CardTitle>Role-Specific Skills Mapping</CardTitle>
              <CardDescription>Define and view skills required for each role or position</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <h3 className="text-lg font-medium mb-4">Roles & Positions</h3>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Roles</SelectItem>
                      {roles.map(role => (
                        <SelectItem key={role.id} value={role.id}>{role.title} ({role.department})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="mt-6 space-y-4">
                    {roles.map(role => (
                      <div 
                        key={role.id} 
                        className={`p-4 border rounded-lg cursor-pointer hover:bg-accent ${selectedRole === role.id ? 'border-primary bg-accent' : 'border-border'}`}
                        onClick={() => setSelectedRole(role.id)}
                      >
                        <div className="font-medium">{role.title}</div>
                        <div className="text-sm text-muted-foreground">{role.department}</div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {role.skills.map(skillId => {
                            const skill = sampleSkills.find(s => s.id === skillId);
                            return skill ? (
                              <Badge key={skillId} variant="secondary" className="text-xs">
                                {skill.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="w-full md:w-2/3">
                  {selectedRole ? (
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        {roles.find(r => r.id === selectedRole)?.title} Required Skills
                      </h3>
                      
                      <div className="grid gap-4">
                        {filteredSkills.map(skill => (
                          <Card key={skill.id}>
                            <CardHeader className="py-4">
                              <CardTitle className="text-lg">{skill.name}</CardTitle>
                              <CardDescription>{skill.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Beginner</span>
                                  <span>Expert</span>
                                </div>
                                <div className="w-full bg-secondary h-2 rounded-full">
                                  <div className="bg-primary h-2 rounded-full" style={{ width: `${(skill.levels.length / 5) * 100}%` }}></div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Expected proficiency: Level {skill.levels.length} - {skill.levels[skill.levels.length - 1].description}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline">Actions</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Add Skill to Role</DropdownMenuItem>
                            <DropdownMenuItem>Edit Required Proficiency</DropdownMenuItem>
                            <DropdownMenuItem>Remove Skill from Role</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[400px] border border-dashed rounded-lg">
                      <div className="text-center text-muted-foreground">
                        <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <h3 className="text-lg font-medium">Select a Role</h3>
                        <p className="max-w-xs mx-auto mt-2">
                          Choose a role from the list to view the required skills and competencies
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="development-plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skill-Based Development Plans</CardTitle>
              <CardDescription>Create and manage development plans to address skill gaps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {developmentPlans.map(plan => (
                  <Card key={plan.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{plan.title}</CardTitle>
                      <CardDescription>
                        Created: {plan.createdAt.toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Target Skills</h4>
                          <div className="flex flex-wrap gap-1">
                            {plan.skills.map(skillId => {
                              const skill = sampleSkills.find(s => s.id === skillId);
                              return skill ? (
                                <Badge key={skillId} variant="secondary">
                                  {skill.name}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1">Objectives</h4>
                          <ScrollArea className="h-32">
                            <ul className="space-y-2">
                              {plan.objectives.map(objective => (
                                <li key={objective.id} className="flex items-start gap-2">
                                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                                    objective.status === 'completed' 
                                      ? 'bg-green-500' 
                                      : objective.status === 'in_progress' 
                                        ? 'bg-amber-500' 
                                        : 'bg-gray-300'
                                  }`} />
                                  <div>
                                    <p className="text-sm">{objective.description}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Due: {objective.dueDate.toLocaleDateString()}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </ScrollArea>
                        </div>
                      </div>
                    </CardContent>
                    <div className="px-6 py-3 bg-muted/50 flex justify-end">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </Card>
                ))}
                
                <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-60">
                  <Target className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Create New Plan</h3>
                  <p className="text-sm text-muted-foreground text-center mt-1 mb-4">
                    Set skill development goals for your team members
                  </p>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    New Development Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="career-paths" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Career Development Paths</CardTitle>
              <CardDescription>View and manage career progression paths within the organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8 py-4">
                <div className="w-full md:w-1/3 space-y-4">
                  <h3 className="text-lg font-medium">Technical Track</h3>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
                    
                    {["Junior Developer", "Developer", "Senior Developer", "Principal Engineer", "CTO"].map((role, index) => (
                      <div key={index} className="relative pl-10 pb-8">
                        <div className="absolute left-2.5 w-5 h-5 bg-primary rounded-full"></div>
                        <h4 className="font-medium">{role}</h4>
                        <p className="text-sm text-muted-foreground">
                          {index + 1}-{index + 3} years
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="w-full md:w-1/3 space-y-4">
                  <h3 className="text-lg font-medium">Management Track</h3>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
                    
                    {["Team Lead", "Engineering Manager", "Director of Engineering", "VP of Engineering", "CTO"].map((role, index) => (
                      <div key={index} className="relative pl-10 pb-8">
                        <div className="absolute left-2.5 w-5 h-5 bg-secondary rounded-full"></div>
                        <h4 className="font-medium">{role}</h4>
                        <p className="text-sm text-muted-foreground">
                          {index + 2}-{index + 4} years
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="w-full md:w-1/3 space-y-4">
                  <h3 className="text-lg font-medium">Skills Required</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Technical Expertise</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Junior</span>
                          <div className="w-32 bg-secondary h-2 rounded-full">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "20%" }}></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Senior</span>
                          <div className="w-32 bg-secondary h-2 rounded-full">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Principal</span>
                          <div className="w-32 bg-secondary h-2 rounded-full">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "90%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Leadership</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Junior</span>
                          <div className="w-32 bg-secondary h-2 rounded-full">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "10%" }}></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Manager</span>
                          <div className="w-32 bg-secondary h-2 rounded-full">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "70%" }}></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Director</span>
                          <div className="w-32 bg-secondary h-2 rounded-full">
                            <div className="bg-primary h-2 rounded-full" style={{ width: "90%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add New Skill Dialog */}
      <Dialog open={isAddSkillDialogOpen} onOpenChange={setIsAddSkillDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
            <DialogDescription>
              Define a new skill or competency and set proficiency levels
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="skill-name" className="text-right text-sm font-medium">Name</label>
              <Input id="skill-name" className="col-span-3" placeholder="e.g., Data Analysis" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="skill-category" className="text-right text-sm font-medium">Category</label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                  <SelectItem value="new_category">+ Add New Category</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="skill-description" className="text-right text-sm font-medium">Description</label>
              <Input id="skill-description" className="col-span-3" placeholder="Brief description of the skill" />
            </div>
            
            <Separator className="my-2" />
            
            <h3 className="font-medium">Proficiency Levels</h3>
            
            {[1, 2, 3, 4, 5].map(level => (
              <div key={level} className="grid gap-4">
                <h4 className="text-sm font-medium">Level {level}</h4>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor={`level-${level}-desc`} className="text-right text-sm">Description</label>
                  <Input id={`level-${level}-desc`} className="col-span-3" placeholder={`Description for level ${level}`} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor={`level-${level}-exp`} className="text-right text-sm">Expectations</label>
                  <Input id={`level-${level}-exp`} className="col-span-3" placeholder="Add expectations separated by commas" />
                </div>
                <Separator className="my-1" />
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSkillDialogOpen(false)}>Cancel</Button>
            <Button>Save Skill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
