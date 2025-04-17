
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Code, HeartHandshake, Trash } from "lucide-react";
import { ReviewSkill } from "@/types";

interface SkillsTableProps {
  skills: ReviewSkill[];
  onDeleteSkill: (skillId: string) => void;
  categoryIcon: "technical" | "soft";
  canDelete: boolean;
}

export function SkillsTable({ skills, onDeleteSkill, categoryIcon, canDelete }: SkillsTableProps) {
  const Icon = categoryIcon === "technical" ? Code : HeartHandshake;
  const iconColor = categoryIcon === "technical" ? "text-blue-500" : "text-purple-500";

  return (
    <div className="border rounded-md">
      {skills.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No skills added yet.</p>
        </div>
      ) : (
        <ScrollArea className="h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill Name</TableHead>
                <TableHead>Description</TableHead>
                {canDelete && <TableHead className="w-[100px]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${iconColor}`} />
                    {skill.name}
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {skill.description}
                  </TableCell>
                  {canDelete && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteSkill(skill.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </div>
  );
}
