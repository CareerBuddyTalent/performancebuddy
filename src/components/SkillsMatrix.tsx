
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dropdown, DropdownContent, DropdownItem, DropdownMenu, DropdownTrigger } from "@/components/ui/dropdown-menu"; 
import { Button } from "@/components/ui/button";
import { Skill, SkillLevel } from "@/types";
import { MoreHorizontal, LineChart, FileText, Download } from "lucide-react";

interface SkillsMatrixProps {
  skills: Skill[];
  selectedCategory?: string;
}

export default function SkillsMatrix({ skills, selectedCategory }: SkillsMatrixProps) {
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);
  
  // Filter skills by category if needed
  const filteredSkills = selectedCategory 
    ? skills.filter(skill => skill.category === selectedCategory) 
    : skills;

  // Group skills by category for better organization
  const skillsByCategory: Record<string, Skill[]> = {};
  filteredSkills.forEach(skill => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = [];
    }
    skillsByCategory[skill.category].push(skill);
  });

  const proficiencyColors = [
    "bg-gray-200",  // Level 1
    "bg-blue-200",  // Level 2
    "bg-green-200", // Level 3
    "bg-yellow-200", // Level 4
    "bg-red-200"    // Level 5
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Skills & Competency Framework</CardTitle>
              <CardDescription>
                Review the skills and competency levels for different roles and positions
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Matrix
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {Object.entries(skillsByCategory).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div key={category} className="space-y-4">
                  <h3 className="text-lg font-medium">{category}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categorySkills.map(skill => (
                      <Badge 
                        key={skill.id}
                        variant={currentSkill?.id === skill.id ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setCurrentSkill(skill)}
                      >
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 mb-4">
              {filteredSkills.map(skill => (
                <Badge 
                  key={skill.id}
                  variant={currentSkill?.id === skill.id ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setCurrentSkill(skill)}
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          )}
          
          {currentSkill ? (
            <div className="space-y-4 mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-medium">{currentSkill.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentSkill.description}</p>
                  <div className="text-sm mt-2">
                    <span className="font-medium">Category:</span> {currentSkill.category}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <LineChart className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
              
              <div className="bg-muted/40 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium mb-2">Proficiency Scale</h4>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div key={level} className="flex-1">
                      <div className={`h-2 ${proficiencyColors[level-1]}`}></div>
                      <div className="text-xs mt-1 text-center">Level {level}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  <div className="text-xs">Beginner</div>
                  <div className="text-xs">Expert</div>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Level</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="hidden md:table-cell">Expectations</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSkill.levels.map((level: SkillLevel) => (
                    <TableRow key={level.level}>
                      <TableCell className="font-medium">
                        <Badge className={`${proficiencyColors[level.level-1]} hover:${proficiencyColors[level.level-1]} text-gray-800`}>
                          Level {level.level}
                        </Badge>
                      </TableCell>
                      <TableCell>{level.description}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <ul className="list-disc ml-4 text-sm">
                          {level.expectations.map((exp, index) => (
                            <li key={index}>{exp}</li>
                          ))}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              Select a skill to view its competency framework
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
