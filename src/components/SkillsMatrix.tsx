
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skill, SkillLevel } from "@/types";

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Skills & Competency Framework</CardTitle>
          <CardDescription>
            Review the skills and competency levels for different roles and positions
          </CardDescription>
        </CardHeader>
        <CardContent>
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
          
          {currentSkill ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">{currentSkill.name}</h3>
                <p className="text-sm text-muted-foreground">{currentSkill.description}</p>
                <div className="text-sm mt-2">
                  <span className="font-medium">Category:</span> {currentSkill.category}
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Level</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Expectations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSkill.levels.map((level: SkillLevel) => (
                    <TableRow key={level.level}>
                      <TableCell className="font-medium">{level.level}</TableCell>
                      <TableCell>{level.description}</TableCell>
                      <TableCell>
                        <ul className="list-disc ml-4 text-sm">
                          {level.expectations.map((exp, index) => (
                            <li key={index}>{exp}</li>
                          ))}
                        </ul>
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
